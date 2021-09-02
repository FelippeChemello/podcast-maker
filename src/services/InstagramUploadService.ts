import puppeteer from 'puppeteer';

import { error, log } from '../utils/log';
import InterfaceJsonContent from '../models/InterfaceJsonContent';

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
        'remotion',
        'dev',
        'desenvolvimento',
    ];

    constructor(content: InterfaceJsonContent) {
        this.content = content;

        if (!process.env.CHROME_BIN) {
            error('Chrome bin path is not defined', 'InstagramUploadService'); // NEEDED FOR INSTAGRAM, BECAUSE WITH CHROMIUM DOESN'T WORK
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
        const details = this.getDetails();

        const browser = await puppeteer.launch({
            executablePath: this.chromeExecutablePath,
            headless: false,
            defaultViewport: null as any,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();

        await page.goto(this.urls.login);

        await page.waitForSelector("input[name='username']");

        const usernameInput = await page.$("input[name='username']");
        const passwordInput = await page.$("input[name='password']");
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

        await page.goto(this.urls.igtvUpload);

        log('Uploading video', 'InstagramUploadService');

        const [videoInput, thumbnailInput] = await page.$$(
            'input[type="file"]',
        );

        if (!videoInput || !thumbnailInput) {
            error('Failed to find media input ', 'InstagramUploadService');
            return;
        }

        videoInput.uploadFile(videoPath);
        await page.waitForFunction(
            () =>
                Array.from(document.querySelectorAll('div')).find(div =>
                    div.innerText.includes('100%'),
                ),
            { timeout: 120000 },
        );

        log('Upload completed', 'InstagramUploadService');
        thumbnailInput.uploadFile(thumbnailPath);

        try {
            log(`Setting details to: \n${details}`, 'InstagramUploadService');
            await page.type('textarea', details);
        } catch (e) {
            log('Failed to set description', 'InstagramUploadService');
        }

        const submitButton = await page.$('button');
        if (!submitButton) {
            error('Failed to find submit button', 'InstagramUploadService');
            return;
        }

        await submitButton.click();

        await page.waitForSelector('button img');

        await browser.close();

        log(`Video published on Instagram`, 'InstagramUploadService');
    }

    private getDetails() {
        let details = `[CodeStack News] ${this.content.title} \n\n`;

        this.content.news.forEach(news => {
            const [title, _] = news.text.split(': ');
            details += `• ${title} \n`;
        });

        if (
            this.content.end?.text &&
            (this.content.end.shortLink || this.content.end.url)
        ) {
            details += `\n\n${this.content.end.text} \n${
                this.content.end.shortLink || this.content.end.url
            } \n\n`;
        }

        this.defaultHashtags.forEach(hashtag => {
            details += `#${hashtag} `;
        });

        return details;
    }
}
