import axios, { AxiosInstance } from 'axios'
import { GoogleGenerativeAI } from '@google/generative-ai';

import { log } from '../utils/log';
import InterfaceJsonContent from '../models/InterfaceJsonContent';

export default class GenerateImageService {
    private content: InterfaceJsonContent;
    private client: AxiosInstance;
    private genAI: GoogleGenerativeAI;

    constructor(content: InterfaceJsonContent) {
        this.content = content;
        this.client = axios.create()
        this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_MAKERSUITE_API_KEY || '')
    }

    public async execute() {
        try {
            log(`Generating prompt for description: ${this.content.news[0].text}`, 'GenerateImageService');

            const model = this.genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                systemInstruction: "Act as a Professional Stable Diffusion Prompter, Your task is to generate a artistic prompt for stable diffusion based on the news provided, this image prompt will be used as a thumbnail for a video, so focus on creating something engaging that describes the news itself. Keep the design simple and engaging.",
                generationConfig: {
                    responseMimeType: "application/json",
                }
            });

            const response = await model.generateContent(this.content.news[0].text)

            const responseText = response.response.text()
            const { prompt } = JSON.parse(responseText)

            log(`Generating image for prompt: ${prompt}`, 'GenerateImageService');

            const encodedPrompt = encodeURIComponent(prompt)
            const url = `${process.env.IMAGE_GENERATOR_URL}/?prompt=${encodedPrompt}&width=1280&height=720`
            const { data } = await this.client.get(
                url, 
                { 
                    responseType: 'arraybuffer', 
                    headers: {
                        'x-api-key': process.env.IMAGE_GENERATOR_API_KEY
                    }
                }
            )
            const base64 = Buffer.from(data, 'binary').toString('base64')

            log(`Generated image for prompt`, 'GenerateImageService');

            this.content.thumbnail_image_src = `data:image/png;base64,${base64}`
        } catch (err) {
            log(`Failed at generating image \n${JSON.stringify(err)}`, 'GenerateImageService');
        }

        return this.content
    }
}