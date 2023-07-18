import axios from 'axios';
import { BingChat } from 'bing-chat'
import fs from 'fs'

import { error, log } from '../utils/log';
import { CreateContentTemplateService } from '.';

type Story = {
    by: string;
    id: number;
    score: number;
    title: string;
    text: string;
}

type Details = {
    videoScript: string;
    videoTitle: string;
    keywords: string[];
    score: number;
}

export default class CreateHackerNewsContent {
    private topStoriesUrl = 'https://hacker-news.firebaseio.com/v0/topstories.json';
    private itemUrl = 'https://hacker-news.firebaseio.com/v0/item';
    private scraper = 'https://scrape.codestack.me/?url='
    private llmClient: BingChat;

    constructor() {
        this.llmClient = new BingChat({
            cookie: 'not-needed',
            debug: true,
        });
    }

    public async execute(): Promise<void> {
        try {
            log('Executing CreateHackerNewsContent', 'CreateHackerNewsContent');

            const topStories = await this.getTopStories(3)

            const stories = await Promise.all(
                topStories.map(async (storyId) => this.getStory(storyId))
            );

            const scripts: any[] = []
            for (const story of stories) {
                const details = await this.getVideoDetails(story)
                scripts.push({
                    ...story,
                    ...details
                })
            }

            console.log("@@@")
            console.log(scripts)


            fs.writeFileSync('stories.json', JSON.stringify(scripts, null, 2))
        } catch (err) {
            console.log(err)

            error(
                `Failed at creating JSON file from HackerNews \n${JSON.stringify(
                    err,
                )}`,
                'CreateHackerNewsContent',
            );
        }
    }

    async getTopStories(quantity?: number): Promise<number[]> {
        const { data } = await axios.get(this.topStoriesUrl);

        return data.slice(0, quantity);
    }

    async getStory(storyId: number): Promise<Story> {
        log(`Getting story ${storyId} `, 'CreateHackerNewsContent');

        const { data } = await axios.get(`${this.itemUrl}/${storyId}.json`);

        let text = data.text;

        if (data.url) {
            const { data: scraperData } = await axios.get(`${this.scraper}${data.url}`);
            text = scraperData.maintext;
        }

        return {
            by: data.by,
            id: data.id,
            score: data.score,
            title: data.title,
            text,
        };
    }

    async getVideoDetails(story: Story): Promise<Details> {
        log(`Getting video script for story ${story.id} - ${story.title}`, 'CreateHackerNewsContent')

        const prompt = `I want you to act as a 3 minutes video script generator. I will provide a blog post and you should generate a comprehensive script that includes an introduction, main points, and a conclusion. Please don't reference the video, the original post, the author neither yourself.  Also, do not make claims beyond what you are writing on the script. Feel free to search the web for additional information about the main theme. At the end of video, invite viewers to check the original post at description.
            Provide it as a JSON object with "video_title", "keywords", "script". The script must be an array of JSON objects splitted by context, each context must contain "text", "image_description", "context" must be intro, topic or outro.

            Title: ${story.title}
            Text: ${story.text.slice(0, 2000)}
        `.replace(/(\r\n|\n|\r)/gm, " ")

        const { text } = await this.llmClient.sendMessage(prompt, {variant: 'Creative'})

        console.log(text)

        const textJsonMatches = text.match(/{(.|\n)*}/gi)
        if (!textJsonMatches) throw new Error('Invalid JSON')

        const textJson = textJsonMatches[0]

        return JSON.parse(textJson)
    }
}
