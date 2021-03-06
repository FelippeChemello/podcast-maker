import axios from 'axios';

import { error, log } from '../utils/log';
import InterfaceJsonContent from '../models/InterfaceJsonContent';

export default class UrlShortenerService {
    private content: InterfaceJsonContent;
    private email: string;
    private password: string;

    constructor(content: InterfaceJsonContent) {
        this.content = content;

        if (!process.env.JAUS_EMAIL) {
            error('E-mail is not defined', 'UrlShortenerService');
            return;
        }

        if (!process.env.JAUS_PASSWORD) {
            error('Password is not defined', 'UrlShortenerService');
            return;
        }

        this.email = process.env.JAUS_EMAIL;
        this.password = process.env.JAUS_PASSWORD;
    }

    public async execute(): Promise<void> {
        const auth = await axios.post('http://links.codestack.me/login', {
            email: this.email,
            password: this.password,
        });

        const token = auth.data.token;

        for (let i = 0; i < this.content.news.length; i++) {
            if (!this.content.news[i].url) {
                continue;
            }

            try {
                log(`Shorting url from news ${i}`, 'UrlShortenerService');
                const rebrandlyResponse = await axios.post(
                    'http://links.codestack.me/create',
                    {
                        long_url: this.content.news[i].url,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                this.content.news[i].shortLink =
                    rebrandlyResponse.data.short_url;
            } catch {
                continue;
            }
        }
    }
}
