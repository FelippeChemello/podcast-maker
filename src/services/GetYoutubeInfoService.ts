
import { error, log } from '../utils/log';
import InterfaceJsonContent from '../models/InterfaceJsonContent';
import { google } from 'googleapis';
import { OAuth2Client } from 'googleapis-common';

export default class GetYoutubeInfoService {
    private readonly channelId = 'UCEQb3ajJgTK_Xr33OE0jeoQ'

    private content: InterfaceJsonContent;
    private redirectUrl = 'http://localhost:3000/oauth2callback';
    private clientId: string;
    private clientSecret: string;
    private refreshToken: string;

    constructor(content: InterfaceJsonContent) {
        this.content = content;

        if (!process.env.GOOGLE_CLIENT_ID) {
            error('Google Client ID is not defined', 'YoutubeUploadService');
            process.exit(1);
        }

        if (!process.env.GOOGLE_CLIENT_SECRET) {
            error(
                'Google Client Secret is not defined',
                'YoutubeUploadService',
            );
            process.exit(1);
        }

        if (!process.env.YOUTUBE_REFRESH_TOKEN) {
            error(
                'Youtube Refresh Token is not defined',
                'YoutubeUploadService',
            );
            process.exit(1);
        }

        this.clientId = process.env.GOOGLE_CLIENT_ID;
        this.clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        this.refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;
    }

    public async execute() {
        const auth = await this.getAccessToken();

        const youtube = google.youtube({
            version: 'v3',
            auth,
        });

        const response = await youtube.channels.list({
            id: [this.channelId],
            part: ['statistics']
        });

        if (!response?.data?.items?.[0]?.statistics
            || !response.data.items[0].statistics.videoCount
            || !response.data.items[0].statistics.subscriberCount
            || !response.data.items[0].statistics.viewCount
        ) {
            return this.content
        }

        const { viewCount, subscriberCount, videoCount } = response.data.items[0].statistics;

        this.content.youtube = {
            viewCount,
            subscriberCount,
            videoCount,
        }

        return this.content;
    }

    private async getAccessToken(): Promise<OAuth2Client> {
        return new Promise(resolve => {
            const { OAuth2 } = google.auth;

            const oauth2client = new OAuth2(
                this.clientId,
                this.clientSecret,
                this.redirectUrl,
            );

            oauth2client.credentials.refresh_token = this.refreshToken;

            oauth2client.refreshAccessToken((err, token: any) => {
                if (err || !token) {
                    error(
                        `Failed at refreshing youtube token \n${JSON.stringify(
                            err,
                        )}`,
                        'YoutubeUploadService',
                    );
                    return;
                }

                oauth2client.credentials = token;

                resolve(oauth2client);
            });
        });
    }
}
