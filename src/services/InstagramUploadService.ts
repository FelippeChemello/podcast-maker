import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

import { error, log } from '../utils/log';
import InterfaceJsonContent from '../models/InterfaceJsonContent';
import { tmpPath } from '../config/defaultPaths';

export default class InstagramUploadService {
    private content: InterfaceJsonContent;
    private email: string;
    private password: string;
    private chromeExecutablePath: string;
    private urls = {
        login: 'https://instagram.com/accounts/login',
        igtvUpload: 'https://www.instagram.com/tv/upload',
    };
    private defaultHashtags = [
        'CodeStackNews',
        'noticias',
        'technews',
        'noticiasrapidas',
        'tecnologia',
        'ia',
        'programacao',
        'newsletter',
        'newsletterfilipedeschamps',
    ];

    constructor(content: InterfaceJsonContent) {
        this.content = content;

        if (!process.env.CHROME_BIN) {
            error('Chrome bin path is not defined', 'InstagramUploadService');
            process.exit(1);
        }

        if (!process.env.INSTAGRAM_EMAIL) {
            error('Instagram e-mail is not defined', 'InstagramUploadService');
            process.exit(1);
        }

        if (!process.env.INSTAGRAM_PASSWORD) {
            error(
                'Instagram password is not defined',
                'InstagramUploadService',
            );
            process.exit(1);
        }

        this.chromeExecutablePath = process.env.CHROME_BIN;
        this.email = process.env.INSTAGRAM_EMAIL;
        this.password = process.env.INSTAGRAM_PASSWORD;
    }

    public async execute(
        videoPath: string,
        thumbnailPath: string,
    ): Promise<void> {
        const title = this.getTitle();

        const description = this.getDescription();

        return new Promise(resolve => {
            puppeteer
                .launch({
                    executablePath: this.chromeExecutablePath,
                })
                .then(async browser => {
                    const page = await browser.newPage();

                    await page.goto(this.urls.login);

                    await page.waitForSelector("input[name='username']");

                    const usernameInput = await page.$(
                        "input[name='username']",
                    );
                    const passwordInput = await page.$(
                        "input[name='password']",
                    );
                    const loginButton = await page.$('button');

                    if (!usernameInput || !passwordInput || !loginButton) {
                        error(
                            'Failed to find username or password inputs',
                            'InstagramUploadService',
                        );
                        process.exit(1);
                    }

                    log('Logging at instagram', 'InstagramUploadService');

                    await usernameInput.click();
                    await page.keyboard.type(this.email);

                    await passwordInput.click();
                    await page.keyboard.type(this.password);

                    await loginButton.click();

                    await page.waitForNavigation();

                    log('Uploading video', 'InstagramUploadService');

                    await page.goto(this.urls.igtvUpload);

                    const [videoInput, thumnailInput] = await page.$$(
                        'input[type="file"]',
                    );
                    const titleInput = await page.$('input[type="text"]');
                    const descriptionInput = await page.$('textarea');
                    const submitButton = await page.$('button');

                    if (
                        !videoInput ||
                        !thumnailInput ||
                        !titleInput ||
                        !descriptionInput ||
                        !submitButton
                    ) {
                        error(
                            'Failed to find input labels',
                            'InstagramUploadService',
                        );
                        return;
                    }

                    videoInput.uploadFile(videoPath);
                    await page.waitForFunction(
                        () =>
                            Array.from(
                                document.querySelectorAll('div'),
                            ).find(div => div.innerText.includes('100%')),
                        { timeout: 120000 },
                    );

                    log('Upload completed', 'InstagramUploadService');
                    thumnailInput?.uploadFile(thumbnailPath);

                    log(`Setting title to: ${title}`, 'InstagramUploadService');
                    await titleInput.click();
                    await page.keyboard.type(title);

                    log(
                        `Setting description to: \n${description}`,
                        'InstagramUploadService',
                    );
                    await descriptionInput.click();
                    await page.keyboard.type(description);

                    await submitButton.click();

                    await page.waitForSelector('button img');

                    await browser.close();

                    log(
                        `Video published on Instagram`,
                        'InstagramUploadService',
                    );

                    resolve();
                });
        });
    }

    private getDescription() {
        let description = '';

        this.content.news.forEach(news => {
            const [title, _] = news.text.split(': ');
            description += `• ${title} \n`;
        });

        if (
            this.content.end?.text &&
            (this.content.end.shortLink || this.content.end.url)
        ) {
            description += `\n\n${this.content.end.text} \n${
                this.content.end.shortLink || this.content.end.url
            } \n\n`;
        }

        this.defaultHashtags.forEach(hashtag => {
            description += `#${hashtag} `;
        });

        return description;
    }

    private getTitle() {
        let title = `[CodeStack News] ${this.content.title} \n\n`;

        if (title.length >= 75) {
            const titleArray = title.split('/');
            titleArray.pop();
            title = titleArray.join('/');
        }

        if (title.length >= 75) {
            const titleArray = title.split('/');
            titleArray.pop();
            title = titleArray.join('/');
        }

        return title;
    }
}
