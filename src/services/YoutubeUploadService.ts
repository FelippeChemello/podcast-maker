import { google } from 'googleapis';
import fs from 'fs';
import cliProgress from 'cli-progress';
import { OAuth2Client } from 'googleapis-common';

import { error, log } from '../utils/log';
import InterfaceJsonContent from '../models/InterfaceJsonContent';

export default class YoutubeUploadService {
    private content: InterfaceJsonContent;
    private redirectUrl = 'http://localhost:5000/oauth2callback';
    private clientId: string;
    private clientSecret: string;
    private refreshToken: string;
    private categoryIds = {
        Entertainment: 24,
        Education: 27,
        ScienceTechnology: 28,
    };
    private defaultTags = [
        'CodeStack News',
        'Noticias',
        'Tecnologia',
        'Noticias rápidas',
        'tech news',
    ];

    constructor(content: InterfaceJsonContent) {
        this.content = content;

        if (!process.env.YOUTUBE_CLIENT_ID) {
            error('Youtube Client ID is not defined', 'YoutubeUploadService');
            return;
        }

        if (!process.env.YOUTUBE_CLIENT_SECRET) {
            error(
                'Youtube Client Secret is not defined',
                'YoutubeUploadService',
            );
            return;
        }

        if (!process.env.YOUTUBE_REFRESH_TOKEN) {
            error(
                'Youtube Refresh Token is not defined',
                'YoutubeUploadService',
            );
            return;
        }

        this.clientId = process.env.YOUTUBE_CLIENT_ID;
        this.clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
        this.refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;
    }

    public async execute(
        videoPath: string,
        thumnailPath: string,
    ): Promise<void> {
        try {
            const auth = await this.getAccessToken();

            const videoid = await this.uploadVideo(auth, videoPath);

            await this.uploadThumbnail(auth, thumnailPath, videoid);
        } catch (err) {
            console.log(err);

            error(
                'Failed at uploading video \n' + JSON.stringify(err),
                'YoutubeUploadService',
            );
        }
    }

    private async getAccessToken(): Promise<OAuth2Client> {
        return new Promise(resolve => {
            const OAuth2 = google.auth.OAuth2;

            const oauth2client = new OAuth2(
                this.clientId,
                this.clientSecret,
                this.redirectUrl,
            );

            oauth2client.credentials.refresh_token = this.refreshToken;

            oauth2client.refreshAccessToken((err, token: any) => {
                if (err || !token) {
                    error(
                        'Failed at refreshing youtube token \n' +
                            JSON.stringify(error),
                        'YoutubeUploadService',
                    );
                    return;
                }

                oauth2client.credentials = token;

                resolve(oauth2client);
            });
        });
    }

    private getDescription() {
        let description = '';

        this.content.news.forEach((news, i) => {
            // Won't add first news to description, since it is the video intro
            if (i != 0) {
                const [title, details] = news.text.split(': ');

                description += `${title.toUpperCase()} \n${
                    details.charAt(0).toUpperCase() + details.slice(1)
                } \n${news.shortLink ?? news.url ?? ''} \n\n`;
            }
        });

        return description;
    }

    private async uploadVideo(
        auth: OAuth2Client,
        videoPath: string,
    ): Promise<string> {
        const youtube = google.youtube({ version: 'v3' });

        log('Starting to upload the video to YouTube', 'YoutubeUploadService');

        const uploadProgressBar = new cliProgress.SingleBar(
            {
                clearOnComplete: true,
                etaBuffer: 50,
                format:
                    '[YoutubeUploadService] Progress {bar} {percentage}% | ETA: {eta}s | {value}/{total} Mb',
            },
            cliProgress.Presets.shades_classic,
        );

        const videoSize = fs.statSync(videoPath).size / 1000000; // Convert to Mb

        uploadProgressBar.start(videoSize, 0, { speed: 'N/A' });

        const youtubeResponse = await youtube.videos.insert(
            {
                auth,
                part: ['snippet', 'status'],
                requestBody: {
                    snippet: {
                        title: `[CodeStack News] ${this.content.title}`,
                        description: this.getDescription(),
                        tags: this.defaultTags,
                        categoryId: `${this.categoryIds.ScienceTechnology}`,
                    },
                    status: {
                        privacyStatus: 'private',
                        madeForKids: false,
                    },
                },
                media: {
                    body: fs.createReadStream(videoPath),
                },
            },
            {
                onUploadProgress: event =>
                    uploadProgressBar.update(event.bytesRead / 1000000),
            },
        );

        uploadProgressBar.stop();

        if (!youtubeResponse.data.id) {
            throw new Error('Youtube video Id is not defined');
        }

        log(
            `Upload completed. Video is available at https://youtu.be/${youtubeResponse.data.id}`,
            'YoutubeUploadService',
        );

        return youtubeResponse.data.id as string;
    }

    private async uploadThumbnail(
        auth: OAuth2Client,
        thumnailPath: string,
        videoId: string,
    ) {
        const youtube = google.youtube({ version: 'v3' });

        log(`Uploading thumbnail`, 'YoutubeUploadService');

        await youtube.thumbnails.set({
            auth,
            videoId,
            media: {
                body: fs.createReadStream(thumnailPath),
            },
        });
    }
}
