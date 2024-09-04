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
                systemInstruction: "Act as a Professional Stable Diffusion Prompter, Your task is to generate a artistic prompt for stable diffusion based on the news provided, this image prompt will be used as a thumbnail for a video, so focus on creating something engaging that describes the news itself.\n\nHow to write the most effective AI image prompt for DALL‑E\nSince you get out of it what you put into it, how do you write a good prompt for DALL‑E? In short, it's best to imagine your image already exists in some kind of online gallery, and then write the kind of short caption you might imagine appearing with it.\n\nBe specific\nIf you enter just a single word—like \"runner,\" for example—you could end up with anything from a photo of an elite athlete winning a marathon to a cute pencil sketch of a child running through a meadow—or, as you see in the example above, even a made-up creature! Rather than using a single word, use a phrase to describe what you're looking for. Here are a few suggestions for additional details to include in your search phrases:\n\nA few specific details about the object or character\nInfo about the setting or background to use for the image\nThe medium style in which it's depicted, such as oil painting, digital photo, or even marble statue\nOther adjectives, such as \"colorful,\" \"swirling,\" \"playful,\" \"happy,\" \"minimalist,\" \"geometric,\" \"vibrant,\" \"dramatic,\" \"ornate,\" \"austere,\" etc.—anything that could help build your desired aesthetic\nAdd directive details Rather than just specifying the medium style as \"oil painting,\" you could describe it as \"oil-on-canvas, masterpiece by Caravaggio, from 1599.\" Or rather than \"photograph,\" you could request \"HD photograph, digital camera, studio lighting, large-format portrait on film.\"\n\nAvoid Complex scenes with multiple subjects\nAvoid Detailed layout requests (for example, \"A big red Object X on the left, friendly Object Y on the right, a small Object Z wearing Item A above them\")\nAvoid Images with multiple faces (these are often distorted)\nAvoid Requests for text (for example, \"a sign saying 'Happy birthday!'\"), because the generator doesn't know how to spell!\n\nThe prompt must be a single paragraph",
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