import axios from 'axios';

import { error, log } from '../utils/log';
import InterfaceJsonContent from '../models/InterfaceJsonContent';

export default class UrlShortenerService {
    private content: InterfaceJsonContent;
    private rebrandlyApiKey: string;
    private rebrandlyWorkspaceId = 'dfff71669fb94fd38131030d58f23ae6';
    private shortUrlBase = 'links.codestack.me';

    constructor(content: InterfaceJsonContent) {
        this.content = content;

        if (!process.env.REBRANDLY_API_KEY) {
            error('Rebrandly API key is not defined', 'UrlShortenerService');
            return;
        }

        this.rebrandlyApiKey = process.env.REBRANDLY_API_KEY;
    }

    public async execute(): Promise<void> {
        for (let i = 0; i < this.content.news.length; i++) {
            if (!this.content.news[i].url) {
                continue;
            }

            try {
                log(`Shorting url from news ${i}`, 'UrlShortenerService');
                const rebrandlyResponse = await axios.post(
                    'https://api.rebrandly.com/v1/links',
                    {
                        destination: this.content.news[i].url,
                        domain: { fullName: this.shortUrlBase },
                    },
                    {
                        headers: {
                            apikey: this.rebrandlyApiKey,
                            workspace: this.rebrandlyWorkspaceId,
                        },
                    },
                );

                this.content.news[
                    i
                ].shortLink = `https://${rebrandlyResponse.data.shortUrl}`;
            } catch {
                continue;
            }
        }
    }
}
