import Algorithmia from 'algorithmia';

class GetTagsFromSentencesService {
    constructor() {}

    public async execute(docsList: string[]): Promise<string[]> {
        return new Promise(
            resolve =>
                Algorithmia.client('simWizJ7AC3JiTc33JmMiHjLAZx1')
                    .algo('nlp/LDA/1.0.0?timeout=300')
                    .pipe({ docsList })
                    .then(function (response) {
                        resolve(response.get());
                    }),
            // .catch(function (error) {
            //     console.log(error);
            // }),
        );
    }
}

export default GetTagsFromSentencesService;
