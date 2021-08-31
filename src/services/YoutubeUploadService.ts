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

        if (!process.env.GOOGLE_REFRESH_TOKEN) {
            error(
                'Google Refresh Token is not defined',
                'YoutubeUploadService',
            );
            process.exit(1);
        }

        this.clientId = process.env.GOOGLE_CLIENT_ID;
        this.clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        this.refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
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
                            JSON.stringify(err),
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
        const descriptionArray: {
            title: string;
            details: string;
            url: string;
        }[] = [];

        this.content.news.forEach((news, i) => {
            const [title, details] = news.text.split(': ');

            descriptionArray.push({
                title: details ? title.toUpperCase() : title,
                details: details
                    ? details.charAt(0).toUpperCase() + details.slice(1)
                    : '',
                url: news.shortLink ?? news.url ?? '',
            });
        });

        if (this.content.end) {
            const [title, details] = this.content.end.text.split(': ');

            descriptionArray.push({
                title: details ? title.toUpperCase() : title,
                details: details
                    ? details.charAt(0).toUpperCase() + details.slice(1)
                    : '',
                url: this.content.end.shortLink ?? this.content.end.url ?? '',
            });
        }

        const charactersLimitPerNews =
            this.descriptionCharactersLimit / descriptionArray.length;

        const newsDescriptionWithDetailsLengthLessThanLimitPerNewsArray = descriptionArray.filter(
            newsDescription =>
                newsDescription.title.length +
                    newsDescription.details.length +
                    newsDescription.url.length <
                charactersLimitPerNews,
        );

        const characterRemain = newsDescriptionWithDetailsLengthLessThanLimitPerNewsArray
            .map(
                newsDescription =>
                    charactersLimitPerNews -
                    (newsDescription.title.length +
                        newsDescription.details.length +
                        newsDescription.url.length),
            )
            .reduce((acc, detailsLength) => acc + detailsLength);

        const quantityOfNewsWithMoreThanLimitPerNews =
            descriptionArray.length -
            newsDescriptionWithDetailsLengthLessThanLimitPerNewsArray.length;

        const increaseEachDetailLimitWith =
            characterRemain / quantityOfNewsWithMoreThanLimitPerNews;

        const newCharactersLimitPerNews =
            charactersLimitPerNews + increaseEachDetailLimitWith;

        let description = '';

        descriptionArray.forEach((newsDescriptions, i) => {
            description += `${newsDescriptions.title} \n`;

            if (newsDescriptions.details) {
                if (
                    newsDescriptionWithDetailsLengthLessThanLimitPerNewsArray.includes(
                        newsDescriptions,
                    )
                ) {
                    description += `${newsDescriptions.details} \n`;
                } else {
                    const newsDetailsCharacterLimit =
                        newCharactersLimitPerNews -
                        newsDescriptions.title.length -
                        newsDescriptions.url.length;

                    const trimmedDetails = newsDescriptions.details.substr(
                        0,
                        newsDetailsCharacterLimit,
                    );

                    description += `${trimmedDetails.substr(
                        0,
                        Math.min(
                            trimmedDetails.length,
                            trimmedDetails.lastIndexOf(' '),
                        ),
                    )}... \n`;
                }
            }

            if (newsDescriptions.url) {
                description += `${newsDescriptions.url} \n`;
            }

            description += '\n';
        });

        return description;
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

        let title = `[CodeStack News] ${this.content.title}`;

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
