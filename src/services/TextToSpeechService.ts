import {
    SpeechSynthesisOutputFormat,
    SpeechConfig,
    AudioConfig,
    SpeechSynthesizer,
    SpeechSynthesisBoundaryType,
} from 'microsoft-cognitiveservices-speech-sdk';
import path from 'path';

import { error, log } from '../utils/log';
import { getPath } from '../config/defaultPaths';
import InterfaceJsonContent from '../models/InterfaceJsonContent';
import Segment from '../models/Segments';

class TextToSpeechService {
    private voices = [
        { chance: 3, name: 'pt-BR-FranciscaNeural' },
        { chance: 3, name: 'pt-BR-AntonioNeural' },
        { chance: 1, name: 'pt-BR-BrendaNeural' },
        { chance: 1, name: 'pt-BR-DonatoNeural' },
        { chance: 1, name: 'pt-BR-ElzaNeural' },
        { chance: 1, name: 'pt-BR-FabioNeural' },
        { chance: 3, name: 'pt-BR-GiovannaNeural' },
        { chance: 3, name: 'pt-BR-HumbertoNeural' },
        { chance: 1, name: 'pt-BR-JulioNeural' },
        { chance: 3, name: 'pt-BR-LeilaNeural' },
        { chance: 0, name: 'pt-BR-LeticiaNeural' },
        { chance: 0, name: 'pt-BR-ManuelaNeural' },
        { chance: 1, name: 'pt-BR-NicolauNeural' },
        { chance: 1, name: 'pt-BR-ValerioNeural' },
        { chance: 1, name: 'pt-BR-YaraNeural' },
    ];
    private azureKey: string;
    private azureRegion: string;
    private voice: string;
    private content: InterfaceJsonContent;

    constructor(content: InterfaceJsonContent) {
        this.content = content;

        if (!process.env.AZURE_TTS_KEY) {
            error('Azure Key is not defined', 'TextToSpeechService');
            return;
        }

        if (!process.env.AZURE_TTS_REGION) {
            error('Azure Region is not defined', 'TextToSpeechService');
            return;
        }

        this.azureKey = process.env.AZURE_TTS_KEY;
        this.azureRegion = process.env.AZURE_TTS_REGION;
        this.content.renderData = [];
    }

    public async execute({
        synthesizeIntro,
        synthesizeEnd,
    }: {
        synthesizeIntro?: boolean;
        synthesizeEnd?: boolean;
    }): Promise<InterfaceJsonContent> {
        const synthesizePromises: Promise<void>[] = [];

        if (synthesizeIntro) {
            synthesizePromises.push(this.synthesizeIntro());
        }

        synthesizePromises.push(this.synthesizeNews());

        await Promise.all(synthesizePromises);

        if (synthesizeEnd) {
            await this.synthesizeEnd()
        }

        return this.content;
    }

    private async synthesizeIntro(): Promise<void> {
        if (!this.content.intro?.text) {
            log('Intro text is not defined, skipping...', 'TextToSeechService');
            return;
        }

        if (typeof this.content.renderData !== 'object') {
            error('Render data is not defined', 'TextToSeechService');
            throw new Error('Render data is not defined');
        }

        log(`Synthesizing Intro`, 'TextToSpeechService');
        const { audioFilePath, segments, duration } = await this.synthesize(
            this.content.intro.text,
            'intro',
        );

        this.content.renderData[0] = {
            text: this.content.intro.text,
            duration,
            audioFilePath,
            segments,
        }
    }

    private async synthesizeNews(): Promise<void> {
        const synthesizePromises = this.content.news.map(async (news, index) => {
            log(`Synthesizing news ${index}`, 'TextToSpeechService');

            const { audioFilePath, segments, duration } = await this.synthesize(
                news.text,
                index.toString(),
            );

            if (typeof this.content.renderData !== 'object') {
                error('Render data is not defined', 'TextToSeechService');
                throw new Error('Render data is not defined');
            }

            this.content.renderData[index + 1] = {
                text: news.text,
                duration,
                audioFilePath,
                segments,
            }
        });

        await Promise.all(synthesizePromises);
    }

    private async synthesizeEnd(): Promise<void> {
        if (!this.content.end?.text) {
            log('End text is not defined, skipping...', 'TextToSeechService');
            return;
        }

        if (typeof this.content.renderData !== 'object') {
            error('Render data is not defined', 'TextToSeechService');
            throw new Error('Render data is not defined');
        }

        log('Synthesizing end', 'TextToSpeechService');
        const { audioFilePath, segments, duration } = await this.synthesize(
            this.content.end.text,
            'end',
        );

        this.content.renderData.push({
            text: this.content.end.text,
            duration,
            audioFilePath,
            segments
        });
    }

    private getVoice() {
        const voicesExtended = this.voices.reduce(
            (acc, voice) => [...acc, ...Array(voice.chance).fill(voice.name)],
            [] as string[],
        );

        if (!this.voice) {
            this.voice =
                voicesExtended[Math.floor(Math.random() * voicesExtended.length)];
        } else {
            let newVoice = voicesExtended[Math.floor(Math.random() * voicesExtended.length)];

            while (newVoice === this.voice) {
                newVoice = voicesExtended[Math.floor(Math.random() * voicesExtended.length)];
            }

            this.voice = newVoice;
        }

        return this.voice;
    }

    private async synthesize(text: string, sufix: string): Promise<{ audioFilePath: string, duration: number, segments: Segment[] }> {
        const tmpPath = await getPath('tmp');
        const segments: Segment[] = []

        return new Promise(resolve => {
            const audioFilePath = path.resolve(tmpPath, `output-${sufix}.mp3`);

            const speechConfig = SpeechConfig.fromSubscription(
                this.azureKey,
                this.azureRegion,
            );

            speechConfig.speechSynthesisOutputFormat =
                SpeechSynthesisOutputFormat.Audio48Khz192KBitRateMonoMp3;
            const audioConfig = AudioConfig.fromAudioFileOutput(audioFilePath);

            const ssml = `
                <speak version="1.0" xml:lang="pt-BR">
                    <voice name="${this.getVoice()}">
                        <break time="250ms" /> ${text}
                    </voice>
                </speak>`;

            const synthesizer = new SpeechSynthesizer(
                speechConfig,
                audioConfig,
            );

            synthesizer.wordBoundary = (s, e) => {
                switch (e.boundaryType) {
                    case SpeechSynthesisBoundaryType.Word:
                        segments.push({
                            start: e.audioOffset / 10000,
                            end: (e.audioOffset + e.duration) / 10000,
                            word: e.text
                        })
                        break;
                    case SpeechSynthesisBoundaryType.Punctuation:
                        segments.push({
                            start: e.audioOffset / 10000,
                            end: (e.audioOffset + e.duration) / 10000,
                            word: e.text
                        })
                        break;
                }
            }

            synthesizer.speakSsmlAsync(
                ssml,
                result => {
                    synthesizer.close();
                    resolve({
                        audioFilePath,
                        duration: result.audioDuration / 10000000, // 100 nanoseconds for each audio duration unit -> to seconds
                        segments
                    });
                },
                err => {
                    synthesizer.close();
                    error(
                        `Synthesize of sentence ${sufix} failed. \n ${err}`,
                        'TextToSpeechService',
                    );
                },
            );
        });
    }
}

export default TextToSpeechService;
