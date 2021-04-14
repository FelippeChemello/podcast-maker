import {
    SpeechSynthesisOutputFormat,
    SpeechConfig,
    AudioConfig,
    SpeechSynthesizer,
} from 'microsoft-cognitiveservices-speech-sdk';
import path from 'path';

import { error, log } from '../utils/log';
import { tmpPath } from '../config/defaultPaths';
import InterfaceJsonContent from '../models/InterfaceJsonContent';

class TextToSpeechService {
    private voices = ['pt-BR-FranciscaNeural', 'pt-BR-AntonioNeural'];
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
    }): Promise<void> {
        if (synthesizeIntro) {
            await this.synthesizeIntro();
        }

        await this.synthesizeNews();

        if (synthesizeEnd) {
            await this.synthesizeEnd();
        }
    }

    private async synthesizeIntro(): Promise<boolean> {
        if (!this.content.intro?.text) {
            log('Intro text is not defined, skipping...', 'TextToSeechService');
            return false;
        }

        if (typeof this.content.renderData !== 'object') {
            error('Render data is not defined', 'TextToSeechService');
            process.exit(1);
        }

        log(`Synthetizing Intro`, 'TextToSpeechService');
        const audioFilePath = await this.synthesize(
            this.content.intro.text,
            'intro',
        );

        this.content.renderData.push({
            text: this.content.intro.text,
            duration: 0,
            audioFilePath,
        });

        return true;
    }

    private async synthesizeNews(): Promise<number> {
        if (typeof this.content.renderData !== 'object') {
            error('Render data is not defined', 'TextToSeechService');
            process.exit(1);
        }

        let i: number;
        for (i = 0; i < this.content.news.length; i++) {
            log(`Synthetizing news ${i}`, 'TextToSpeechService');
            const audioFilePath = await this.synthesize(
                this.content.news[i].text,
                i.toString(),
            );

            this.content.renderData.push({
                text: this.content.news[i].text,
                duration: 0,
                audioFilePath,
            });
        }

        return i;
    }

    private async synthesizeEnd(): Promise<void> {
        if (!this.content.end?.text) {
            log('End text is not defined, skipping...', 'TextToSeechService');
            return;
        }

        if (typeof this.content.renderData !== 'object') {
            error('Render data is not defined', 'TextToSeechService');
            process.exit(1);
        }

        log('Synthetizing end', 'TextToSpeechService');
        const audioFilePath = await this.synthesize(
            this.content.end.text,
            'end',
        );

        this.content.renderData.push({
            text: this.content.end.text,
            duration: 0,
            audioFilePath,
        });
    }

    private getVoice() {
        if (!this.voice) {
            this.voice = this.voices[1];
        } else {
            const voiceIndex = this.voices.findIndex(
                voice => this.voice === voice,
            );

            this.voice = this.voices[voiceIndex === 0 ? 1 : 0];
        }

        return this.voice;
    }

    private async synthesize(text: string, sufix: string): Promise<string> {
        return new Promise(resolve => {
            const outputFilePath = path.resolve(tmpPath, `output-${sufix}.mp3`);

            const speechConfig = SpeechConfig.fromSubscription(
                this.azureKey,
                this.azureRegion,
            );

            speechConfig.speechSynthesisOutputFormat =
                SpeechSynthesisOutputFormat.Audio24Khz160KBitRateMonoMp3;
            const audioConfig = AudioConfig.fromAudioFileOutput(outputFilePath);

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
            synthesizer.speakSsmlAsync(
                ssml,
                result => {
                    synthesizer.close();
                    resolve(outputFilePath);
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
