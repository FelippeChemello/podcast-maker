import { google } from 'googleapis';
import fs from 'fs';
import { OAuth2Client } from 'googleapis-common';

import { error, log } from '../utils/log';
import Bar from '../utils/CliProgress/bar';
import InterfaceJsonContent from '../models/InterfaceJsonContent';

export default class YoutubeUploadService {
    private content: InterfaceJsonContent;
    private redirectUrl = 'http://localhost:3000/oauth2callback';
    private clientId: string;
    private clientSecret: string;
    private refreshToken: string;
    private descriptionCharactersLimit = 5000 - 100; // 100 is the safe area to avoid errors
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
        'CodeStackNews',
        'technews',
        'ia',
        'programacao',
        'newsletter',
        'newsletterfilipedeschamps',
        'remotion',
        'dev',
        'desenvolvimento',
    ];

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

    public async execute(
        videoPath: string,
        thumbnailPath: string,
    ): Promise<void> {
        try {
            const auth = await this.getAccessToken();

            const videoId = await this.uploadVideo(auth, videoPath);

            await this.uploadThumbnail(auth, thumbnailPath, videoId);
        } catch (err) {
            error(
                `Failed at uploading video \n${JSON.stringify(err)}`,
                'YoutubeUploadService',
            );
        }
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

    private getDescription() {
        if (!this.content.renderData) {
            return '';
        }

        let description = '📰 Acompanhe as notícias do mundo da tecnologia e da programação. 📰\n\n';
        let timestamp = 0;
        const news = this.content.renderData.slice(1, -1)
        news.forEach((item, index, array) => {
            description += `${this.formatTime(timestamp)} ${item.text.split(':')[0]} \n`;

            timestamp += item.duration;
        })

        if (this.content.end?.url || this.content.news.some(news => news.url)) {
            description += `\n\n🌐 Links: \n`;
            this.content.end?.url && (description += `${this.content.end.url} \n`);
            this.content.news.filter(news => news.url).forEach(news => {
                description += `${news.url} \n`;
            })
        }

        description += `\n\n📢 Inscreva-se no canal: https://www.youtube.com/@CodeStackMe?sub_confirmation=1 \n`;
        description += `💻 Me siga no GitHub: https://github.com/FelippeChemello \n`;

        return description;
    }

    private formatTime(seconds: number) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const paddedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
        return `${minutes}:${paddedSeconds}`;
    }


    private async uploadVideo(
        auth: OAuth2Client,
        videoPath: string,
    ): Promise<string> {
        const youtube = google.youtube({ version: 'v3' });

        log('Uploading video to YouTube', 'YoutubeUploadService');

        const videoSize =
            Math.floor((fs.statSync(videoPath).size / 1000000) * 100) / 100;

        const uploadProgressBar = new Bar({
            total: videoSize,
            initValue: 0,
            text:
                '[YoutubeUploadService] Progress {bar} {percentage}% | ETA: {eta}s | {value}/{total} Mb',
        });

        let title = this.content.title

        if (title.length >= 100) {
            const titleArray = title.split('/');
            titleArray.pop();
            title = titleArray.join('/');
        }

        const youtubeResponse = await youtube.videos.insert(
            {
                auth,
                part: ['snippet', 'status'],
                requestBody: {
                    snippet: {
                        title,
                        description: this.getDescription(),
                        tags: this.defaultTags,
                        categoryId: `${this.categoryIds.ScienceTechnology}`,
                    },
                    status: {
                        privacyStatus: 'public',
                        madeForKids: false,
                    },
                },
                media: {
                    body: fs.createReadStream(videoPath),
                },
            },
            {
                onUploadProgress: event =>
                    uploadProgressBar.update(
                        Math.floor(event.bytesRead / 10000) / 100,
                    ),
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
