import { GoogleGenAI, Type } from '@google/genai'

import { log } from '../utils/log';
import InterfaceJsonContent from '../models/InterfaceJsonContent';

export default class GenerateTitleService {
    private content: InterfaceJsonContent;
    private client: GoogleGenAI;

    constructor(content: InterfaceJsonContent) {
        this.content = content;
        this.client = new GoogleGenAI({ apiKey: process.env.GOOGLE_MAKERSUITE_API_KEY })
    }

    public async execute() {
        try {
            const firstNews = this.content.news[0].text
            log(`Generating title for: ${firstNews}`, 'GenerateTitleServce');

            const response = await this.client.models.generateContent({
                contents: `Act as a Professional Title Generator, your task is to generate a title for the following news in less than 5 words. The title must be in portuguese. The main news is: "${firstNews}"`,
                model: 'gemini-2.0-flash',
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            title: {
                                type: Type.STRING,
                                description: 'Title for the news'
                            }
                        }
                    }
                }
            })

            const { title } = JSON.parse(response.text!)

            log(`Title generated: ${title}`, 'GenerateTitleServce');

            this.content.thumbnail_text = title.trim().length > 0 ? title : this.content.title.split("/")[0]
        } catch (err) {
            console.log(err)

            log(`Failed at generating title \n${JSON.stringify(err)}`, 'GenerateTitleServce');
            this.content.thumbnail_text = this.content.title.split("/")[0]

            process.exit(1)
        }

        return this.content
    }
}