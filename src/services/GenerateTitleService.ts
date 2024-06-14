import { GoogleGenerativeAI } from '@google/generative-ai'

import { log } from '../utils/log';
import InterfaceJsonContent from '../models/InterfaceJsonContent';

export default class GenerateTitleServce {
    private content: InterfaceJsonContent;
    private client: GoogleGenerativeAI;

    constructor(content: InterfaceJsonContent) {
        this.content = content;
        this.client = new GoogleGenerativeAI(process.env.GOOGLE_MAKERSUITE_API_KEY || '')
    }

    public async execute() {
        try {
            const firstNews = this.content.news[0].text
            log(`Generating title for: ${firstNews}`, 'GenerateTitleServce');

            const model = this.client.getGenerativeModel({
                model: 'gemini-1.5-flash',
            })

            const prompt = `Gere um titulo que gere engajamento para o video com a seguinte descrição: ${firstNews}`

            const response = await model.generateContent(prompt)

            const titles = response.response.text()
            const title = titles.split('\n')[0].replaceAll("\"", "")

            log(`Title generated: ${title}`, 'GenerateTitleServce');

            this.content.thumbnail_text = title
        } catch (err) {
            log(`Failed at generating title \n${JSON.stringify(err)}`, 'GenerateTitleServce');
            this.content.thumbnail_text = this.content.title.split("/")[0]
        }

        return this.content
    }
}