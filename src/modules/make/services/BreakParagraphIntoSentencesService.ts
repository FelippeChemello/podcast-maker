import Algorithmia from 'algorithmia';

class BreakParagraphIntoSentencesService {
    constructor() {}

    public async execute(text: string): Promise<string[]> {
        return new Promise(resolve =>
            Algorithmia.client('simWizJ7AC3JiTc33JmMiHjLAZx1')
                .algo('StanfordNLP/SentenceSplit/0.1.0?timeout=60')
                .pipe(text)
                .then(function (response) {
                    resolve(response.get());
                }),
        );
    }
}

export default BreakParagraphIntoSentencesService;
