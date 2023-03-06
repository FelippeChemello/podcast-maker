import numpy as np
import os
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
import torchaudio
import torch
import ffmpeg
from dataclasses import dataclass
import json
from tqdm import tqdm
import wave

HF_MODEL = "jonatasgrosman/wav2vec2-large-xlsr-53-portuguese"
DEFAULT_SAMPLE_RATE = 16000
device = "cuda" if torch.cuda.is_available() else "cpu"

def load_model():
    print("> Loading model...")
    model = Wav2Vec2ForCTC.from_pretrained(HF_MODEL).to(device)
    
    processor = Wav2Vec2Processor.from_pretrained(HF_MODEL)
    vocab = list(processor.tokenizer.get_vocab().keys())

    return model, processor, vocab

def get_audio(audio_dir: str):
    print("> Loading audio files...")
    audios = {}
    
    for filename in os.listdir(audio_dir):
        if filename.endswith(".mp3"):
            mp3_path = os.path.join(audio_dir, filename)
            wav_path = os.path.join(audio_dir, os.path.splitext(filename)[0] + ".wav")
            try:
                (
                    ffmpeg.input(mp3_path, threads=0)
                    .output(wav_path, format="wav", acodec="pcm_s16le", ac=1, ar=DEFAULT_SAMPLE_RATE)
                    .overwrite_output()
                    .run(cmd=["ffmpeg", "-nostdin"], capture_stdout=True, capture_stderr=True)
                )
            except ffmpeg.Error as e:
                raise RuntimeError(f"Failed to convert MP3 file {filename} to WAV: {e.stderr.decode()}") from e

            audio_path = wav_path
        elif filename.endswith(".wav"):
            audio_path = os.path.join(audio_dir, filename)
        else:
            continue

        if not os.path.isfile(audio_path):
            raise RuntimeError(f"Audio file {filename} not found")

        print(f"> Loading {audio_path}...")

        with wave.open(audio_path, "rb") as f:
            sample_rate = f.getframerate()

        resampler = torchaudio.transforms.Resample(sample_rate, DEFAULT_SAMPLE_RATE)
        audio, _ = torchaudio.load(audio_path)
        resampled_audio = resampler(audio).squeeze().numpy()

        audios[os.path.splitext(filename)[0].split("-")[1]] = resampled_audio
    
    return audios
            

def get_news_text(content_file: str):
    print("> Loading news text...")

    with open(content_file, "r") as f:
        content = json.load(f)

    # segmenter = pysbd.Segmenter(language="pt", clean=False)
    # segmenter.segment(content["news"][0]["text"])

    segmented_news = {str(index): info['text'] for index, info in enumerate(content["news"])}
    segmented_news["intro"] = content["intro"]['text']
    segmented_news["end"] = content["end"]['text']

    return segmented_news

@dataclass
class Point:
    token_index: int
    time_index: int
    score: float

@dataclass
class Segment:
    label: str
    start: int
    end: int

    @property
    def length(self):
        return self.end - self.start

def get_trellis(emission, tokens): 
    print("> Calculating trellis...")

    num_frames = emission.size(0)
    num_tokens = len(tokens)

    trellis = torch.full((num_frames + 1, num_tokens + 1), -float("inf"), device=device)
    trellis[:, 0] = 0
    for t in range(num_frames):
        trellis[t + 1, 1:] = torch.maximum(
            trellis[t, 1:] + emission[t, 0],
            trellis[t, :-1] + emission[t, tokens],
        )
    
    return trellis

def backtrack(trellis, emission, tokens):
    print("> Backtracking...")

    i = trellis.size(1) - 1
    t_start = torch.argmax(trellis[:, i]).item()

    path = []
    for t in range(t_start, 0, -1):
        stayed = trellis[t - 1, i] + emission[t - 1, 0]
        changed = trellis[t - 1, i - 1] + emission[t - 1, tokens[i - 1]]

        prob = emission[t - 1, tokens[i - 1] if changed > stayed else 0].exp().item()
        path.append(Point(i - 1, t - 1, prob))

        if changed > stayed:
            i -= 1
            if i == 0:
                break
    
    else:
        raise RuntimeError("Failed to align audio and text")
    
    return path[::-1]

def merge_repeats(transcript, path): 
    print("> Merging repeated tokens...")

    i1, i2 = 0, 0
    segments = []
    initialCharacterIndex = 0

    while i1 < len(path):
        while i2 < len(path) and path[i1].token_index == path[i2].token_index:
            i2 += 1

        character = transcript[path[i1].token_index]
        if character == "|":
            segments.append(
                Segment(
                    label=transcript[path[initialCharacterIndex].token_index: path[i1].token_index],
                    start=path[initialCharacterIndex].time_index * 20,
                    end=(path[i2 - 1].time_index + 1) * 20,
                )
            )

            initialCharacterIndex = i2

        i1 = i2
    
    return segments


def main(content_file_path: str, audio_dir_path: str):
    audio = get_audio(audio_dir_path)
    news_text = get_news_text(content_file_path)

    content = {}

    for key in audio:
        if key not in news_text:
            raise RuntimeError(f"Audio file {key} does not have a corresponding news text")
        
        content[key] = {
            "audio": audio[key],
            "text": news_text[key],
        }

    model, processor, vocab = load_model()

    for index, item in tqdm(content.items()):
        print(f"Processing audio file {index}...")

        speech = item["audio"]
        text = item["text"]
        
        inputs = processor(speech, sampling_rate=DEFAULT_SAMPLE_RATE, return_tensors="pt", padding=True).to(device)

        with torch.no_grad():
            logits = model(inputs.input_values).logits

        emission = torch.softmax(logits, dim=-1)[0].to(device).detach()
        labels = ([""] + vocab)[:-1]
        dictionary = {char: index for index, char in enumerate(labels)}
        tokens = []

        transcript = "|".join(text.split(" "))
        for char in transcript:
            if char in dictionary:
                tokens.append(dictionary[char])
        
        trellis = get_trellis(emission, tokens)

        path = backtrack(trellis, emission, tokens)

        segments = merge_repeats(transcript, path)

        with open(content_file_path, "r+", encoding="utf-8") as content_file:
            json_content = json.load(content_file)
            parsed_segment = {segment.label: {"start": segment.start, "end": segment.end} for segment in segments}

            if index.isdigit():
                json_content["news"][int(index)]["segments"] = parsed_segment
            else:
                json_content[index]["segments"] = parsed_segment

            content_file.seek(0)
            json.dump(json_content, content_file, ensure_ascii=False, indent=4)
            content_file.truncate()



if __name__ == "__main__":
    main("/home/felippe/Projects/podcast-maker/video/tmp/example.json", "/home/felippe/Projects/podcast-maker/video/tmp")
    

