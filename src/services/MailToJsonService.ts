import { google } from 'googleapis';
import { parse as parseToHtml } from 'node-html-parser';
import { OAuth2Client } from 'googleapis-common';

import { error, log } from '../utils/log';
import { CreateContentTemplateService } from '.';

export default class MailToJsonService {
    private senderMail = 'newsletter@filipedeschamps.com.br';
    private redirectUrl = 'http://localhost:3000/oauth2callback';
    private clientId: string;
    private clientSecret: string;
    private refreshToken: string;

    constructor() {
        if (!process.env.GOOGLE_CLIENT_ID) {
            error('Google Client ID is not defined', 'MailToJsonService');
            process.exit(1);
        }

        if (!process.env.GOOGLE_CLIENT_SECRET) {
            error('Google Client Secret is not defined', 'MailToJsonService');
            process.exit(1);
        }

        if (!process.env.GOOGLE_REFRESH_TOKEN) {
            error('Google Refresh Token is not defined', 'MailToJsonService');
            process.exit(1);
        }

        this.clientId = process.env.GOOGLE_CLIENT_ID;
        this.clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        this.refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    }

    public async execute(): Promise<void> {
        try {
            log('Executing MailToJsonService', 'MailToJsonService');
            const auth = await this.getAccessToken();

            const { news, title } = await this.getNewsFromEmail(auth);

            await this.createContentFile(news, title);
        } catch (err) {
            error(
                `Failed at creating JSON file from mail \n${JSON.stringify(
                    err,
                )}`,
                'MailToJsonService',
            );
        }
    }

    private async getAccessToken(): Promise<OAuth2Client> {
        log('Getting access token', 'MailToJsonService');

        return new Promise(resolve => {
            const { OAuth2 } = google.auth;

            const oauth2client = new OAuth2(
                this.clientId,
                this.clientSecret,
                this.redirectUrl,
            );

            oauth2client.setCredentials({
                refresh_token: this.refreshToken,
            });

            oauth2client.refreshAccessToken(async (err, token: any) => {
                if (err || !token) {
                    error(
                        `Failed at refreshing Google token \n${JSON.stringify(
                            err,
                        )}`,
                        'MailToJsonService',
                    );
                    return;
                }

                oauth2client.setCredentials(token);

                resolve(oauth2client);
            });
        });
    }

    private async getNewsFromEmail(
        auth: OAuth2Client,
    ): Promise<{ news: string[]; title: string }> {
        log('Getting mail content', 'MailToJsonService');

        const gmail = google.gmail({ version: 'v1', auth });

        const today = new Date();
        const yesterday = new Date(today);
        const tomorrow = new Date(today);

        tomorrow.setDate(tomorrow.getDate() + 1);
        yesterday.setDate(yesterday.getDate() - 1);

        const yesterdayFormatted = `${yesterday.getFullYear()}/${
            yesterday.getMonth() + 1
        }/${yesterday.getDate()}`;
        const tomorrowFormatted = `${tomorrow.getFullYear()}/${
            tomorrow.getMonth() + 1
        }/${tomorrow.getDate()}`;

        const mailList = await gmail.users.messages.list({
            userId: 'me',
            q: `from:(${this.senderMail}) after:${yesterdayFormatted} before:${tomorrowFormatted}`,
            maxResults: 1,
        });

        if (!mailList.data.messages?.length || !mailList.data.messages[0].id) {
            error('No mail found', 'MailToJsonService');
            return {} as any;
        }

        const messageId = mailList.data.messages[0].id;

        const mail = await gmail.users.messages.get({
            userId: 'me',
            id: messageId,
        });

        if (!mail.data.payload || !mail.data.payload.parts?.length) {
            error('No mail payload found', 'MailToJsonService');
            return {} as any;
        }

        const title =
            mail.data.payload.headers?.filter(
                header => header.name === 'Subject',
            )[0].value || '';

        const htmlBase64Mail = mail.data.payload?.parts.filter(
            part => part.mimeType === 'text/html',
        )[0];

        if (!htmlBase64Mail || !htmlBase64Mail.body?.data) {
            error('No mail body found', 'MailToJsonService');
            return {} as any;
        }

        const htmlMail = Buffer.from(
            htmlBase64Mail.body.data,
            'base64',
        ).toString();

        const parsed = parseToHtml(htmlMail, {
            comment: false,
            blockTextElements: {
                script: false,
                noscript: false,
                style: false,
                pre: false,
            },
        });

        const paragraphs = parsed
            .querySelectorAll('tbody p')
            .map(p => p.innerHTML);

        const paragraphsWithoutIntroAndLinks = paragraphs
            .slice(1, paragraphs.length)
            .filter(paragraph => {
                return paragraph.indexOf('<a href') === -1;
            });

        const sanitizedText = paragraphsWithoutIntroAndLinks.map(paragraph => {
            const p = parseToHtml(paragraph);

            return p.innerText
                .replace(/\r|\n|\t/g, '')
                .replace('      ', '')
                .replace(/"\w/g, '“')
                .replace(/\w"/g, '”');
        });

        return { news: sanitizedText, title };
    }

    private async createContentFile(news: string[], title: string) {
        const createContentTemplateService = new CreateContentTemplateService();

        const today = new Date();

        const description = `${
            `${today.getDate()}`.padStart(2, '0') +
            `${today.getMonth() + 1}`.padStart(2, '0')
        }${today.getFullYear()}`;

        await createContentTemplateService.execute(description, {
            news,
            title,
        });
    }
}
