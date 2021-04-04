import axios from 'axios';

import { error, log } from '../utils/log';
import InterfaceJsonContent from '../models/InterfaceJsonContent';

export default class UrlShortenerService {
    private content: InterfaceJsonContent;
    private bitlyApiKey: string;
    private bitlyGroup = 'felippechemello';

    constructor(content: InterfaceJsonContent) {
        this.content = content;

        if (!process.env.BITLY_API_KEY) {
            error('Bitly API key is not defined', 'UrlShortenerService');
            return;
        }

        this.bitlyApiKey = process.env.BITLY_API_KEY;
    }

    public async execute(): Promise<void> {
        for (let i = 0; i < this.content.news.length; i++) {
            if (!this.content.news[i].url) {
                continue;
            }

            log(`Shorting url from news ${i}`, 'UrlShortenerService');
            const bitlyResponse = await axios.post(
                'https://api-ssl.bitly.com/v4/shorten',
                {
                    long_url: this.content.news[i].url,
                    group_guid: this.bitlyGroup,
                },
                { headers: { Authorization: `Bearer ${this.bitlyApiKey}` } },
            );

            console.log(bitlyResponse);

            // this.content.news[i].shortLink = bitlyResponse.link;
        }
    }
}
