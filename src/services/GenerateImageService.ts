import axios, { AxiosInstance } from 'axios'
import { GoogleGenAI, Type } from '@google/genai';

import { log } from '../utils/log';
import InterfaceJsonContent from '../models/InterfaceJsonContent';

export default class GenerateImageService {
    private content: InterfaceJsonContent;
    private client: AxiosInstance;
    private genAI: GoogleGenAI;

    constructor(content: InterfaceJsonContent) {
        this.content = content;
        this.client = axios.create()
        this.genAI = new GoogleGenAI({ apiKey: process.env.GENAI_API_KEY })
    }

    public async execute() {
        try {
            log(`Generating prompt for description: ${this.content.news[0].text}`, 'GenerateImageService');

            const promptResult = await this.genAI.models.generateContent({
                model: 'gemini-2.0-flash',
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            prompt: {
                                type: Type.STRING,
                                description: 'Prompt for image generation'
                            }
                        }
                    }
                },
                contents: `
                    Act as a Professional Stable Diffusion Prompter, Your task is to generate a artistic and super detailed prompt for stable diffusion based on the news provided, this image prompt will be used as a thumbnail for a video, so focus on creating something engaging that describes the news itself. Keep the design simple and engaging. Avoid describing text in the thumbnail since Stable Diffusion does not work well with text. 
                    
                    The main news is: "${this.content.news[0].text}"
                `,
            })

            const { prompt } = JSON.parse(promptResult.text!).prompt

            log(`Generating image for prompt: ${prompt}`, 'GenerateImageService');

            try {
                const imageResult = await this.genAI.models.generateContent({
                    model: 'gemini-2.0-flash-exp-image-generation',
                    contents: `Generate an image for the following prompt: ${prompt}`,
                    config: {
                        responseModalities: ['text', 'image'],
                    }
                })

                const part = imageResult.candidates![0].content?.parts![0]
                if (part && part.inlineData) {
                    const mimeFile = part.inlineData.mimeType
                    const base64 = part.inlineData.data

                    log(`Generated image for prompt via Gemini`, 'GenerateImageService');

                    this.content.thumbnail_image_src = `data:${mimeFile};base64,${base64}`
                } else {
                    throw new Error('Image generation failed or no image returned')
                }
            } catch (err) {
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

                log(`Generated image for prompt via Flux`, 'GenerateImageService');

                this.content.thumbnail_image_src = `data:image/png;base64,${base64}`
            }
        } catch (err) {
            log(`Failed at generating image \n${JSON.stringify(err)}`, 'GenerateImageService');
        }

        return this.content
    }
}