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
                model: 'gemini-2.0-flash',
                systemInstruction: "Act as an excellent title generator, your task is to generate a title for the provided news in less than 5 words. The title must be in portuguese.",
                generationConfig: {
                    temperature: 1,
                    topP: 0.95,
                    topK: 64,
                    maxOutputTokens: 50,
                    responseMimeType: 'application/json'
                }
            })

            const response = await model.generateContent(firstNews)

            const { title } = JSON.parse(response.response.text())

            log(`Title generated: ${title}`, 'GenerateTitleServce');

            this.content.thumbnail_text = title.trim().length > 0 ? title : this.content.title.split("/")[0]
        } catch (err) {
            log(`Failed at generating title \n${JSON.stringify(err)}`, 'GenerateTitleServce');
            this.content.thumbnail_text = this.content.title.split("/")[0]
        }

        return this.content
    }
}