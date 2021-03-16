class CreateVideoClipService {
    constructor() {}

    public async execute(text: string, duration: number): Promise<void> {
        return new Promise(resolve => {
            const speechConfig = SpeechConfig.fromSubscription(
                'd0a5a0c73744412c96bd3bd8dff9b7f9',
                'southcentralus',
            );

            speechConfig.speechSynthesisOutputFormat =
                SpeechSynthesisOutputFormat.Audio24Khz160KBitRateMonoMp3;
            const audioConfig = AudioConfig.fromAudioFileOutput(
                path.resolve(
                    __dirname,
                    '..',
                    '..',
                    '..',
                    '..',
                    'tmp',
                    `output-${sufix}.mp3`,
                ),
            );

            const ssml = `
                <speak version="1.0" xml:lang="pt-BR">
                    <voice name="pt-BR-FranciscaNeural">
                        ${text}
                    </voice>
                </speak>`;

            const synthesizer = new SpeechSynthesizer(
                speechConfig,
                audioConfig,
            );
            synthesizer.speakSsmlAsync(
                ssml,
                result => {
                    if (result) {
                        console.log(JSON.stringify(result));
                    }
                    synthesizer.close();
                    resolve();
                },
                error => {
                    console.log(error);
                    synthesizer.close();
                },
            );
        });
    }
}

export default TextToSpeechService;
