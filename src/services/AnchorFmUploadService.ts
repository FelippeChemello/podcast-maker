import puppeteer from 'puppeteer';

import { error, log } from '../utils/log';
import InterfaceJsonContent from '../models/InterfaceJsonContent';

export default class AnchorFmUploadService {
    private content: InterfaceJsonContent;
    private email: string;
    private password: string;
    private chromeExecutablePath: string;
    private defaultUrl =
        'https://www.youtube.com/channel/UCEQb3ajJgTK_Xr33OE0jeoQ';
    private urls = {
        login: 'https://anchor.fm/login',
        upload: 'https://anchor.fm/dashboard/episode/new',
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
            error('Chrome bin path is not defined', 'AnchorFmUploadService');
            process.exit(1);
        }

        if (!process.env.ANCHORFM_EMAIL) {
            error('AnchorFM e-mail is not defined', 'AnchorFmUploadService');
            process.exit(1);
        }

        if (!process.env.ANCHORFM_PASSWORD) {
            error('AnchorFM password is not defined', 'AnchorFmUploadService');
            process.exit(1);
        }

        this.chromeExecutablePath = process.env.CHROME_BIN;
        this.email = process.env.ANCHORFM_EMAIL;
        this.password = process.env.ANCHORFM_PASSWORD;
    }

    public async execute(
        audioPath: string,
        thumbnailPath: string,
    ): Promise<void> {
        const title = this.getTitle();

        const description = this.getDescription();

        const browser = await puppeteer.launch({
            executablePath: this.chromeExecutablePath,
            headless: false,
            defaultViewport: null as any,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();

        await page.goto(this.urls.login);

        await page.waitForSelector("input[name='email']");

        const emailInput = await page.$("input[name='email']");
        const passwordInput = await page.$("input[name='password']");
        const loginButton = await page.$('button[type="submit"]');

        if (!emailInput || !passwordInput || !loginButton) {
            error(
                'Failed to find username or password inputs',
                'AnchorFmUploadService',
            );
            process.exit(1);
        }

        log('Logging at Anchor.FM', 'AnchorFmUploadService');

        await emailInput.click();
        await page.keyboard.type(this.email);

        await passwordInput.click();
        await page.keyboard.type(this.password);

        await loginButton.click();

        await page.waitForNavigation();

        await page.goto(this.urls.upload);

        await page.waitForSelector('input');

        log('Getting submit button', 'AnchorFmUploadService');

        await page.evaluate(() => {
            const saveButton = document.querySelector(
                '#app > div > div button[type="button"]',
            );

            if (!saveButton) {
                console.log(
                    `[AnchorFmUploadService] [ERROR] Failed to find Save Episode button`,
                );
                process.exit(1);
            }

            saveButton.id = 'save-episode-button';
        });

        log('Uploading video', 'AnchorFmUploadService');

        const videoInput = await page.$('input[type="file"]');

        if (!videoInput) {
            error('Failed to find media input ', 'AnchorFmUploadService');
            return;
        }

        await videoInput.uploadFile(audioPath);

        await page.waitForSelector('#save-episode-button[disabled]');
        await page.waitForSelector('#save-episode-button:not([disabled])', {
            timeout: 300000,
        });

        log('Upload completed', 'AnchorFmUploadService');

        await page.click('#save-episode-button');

        await page.waitForNavigation();
        await page.waitForSelector('input[type="text"]');

        const [_, publishButton] = await page.$$(
            '#app > div > div button[type="submit"]',
        );

        if (!publishButton) {
            error('Failed to find publish button', 'AnchorFmUploadService');
        }

        log(`Setting title to: ${title}`, 'AnchorFmUploadService');
        await page.type('input[type="text"]', title);

        log('Changing descrition to HTML mode', 'AnchorFmUploadService');
        await page.click('#app > div > div button[type="button"]');

        log(
            `Setting description to: \n${description}`,
            'AnchorFmUploadService',
        );
        await page.type('textarea', description);

        log('Uploading Thumbnail', 'AnchorFmUploadService');
        const thumbnailInput = await page.$('input[type="file"]');

        if (!thumbnailInput) {
            error('Failed to find thumbnail input ', 'AnchorFmUploadService');
            return;
        }

        await thumbnailInput.uploadFile(thumbnailPath);

        await page.waitForSelector(
            'div.modal-dialog button[type="button"]:not(.close)',
        );
        await page.click('div.modal-dialog button[type="button"]:not(.close)');
        await page.waitForTimeout(1000);

        await publishButton.click();

        await page.waitForNavigation();

        await browser.close();

        log(`Video published on Anchor.FM`, 'AnchorFmUploadService');
    }

    private getDescription() {
        let description = '';

        this.content.news.forEach(news => {
            const [title, _] = news.text.split(': ');
            description += `• <a src="${
                news.shortLink || news.url || this.defaultUrl
            }"> ${title} </a> <br> \n`;
        });

        if (
            this.content.end?.text &&
            (this.content.end.shortLink || this.content.end.url)
        ) {
            description += `<br><br>${this.content.end.text} <br>\n${
                this.content.end.shortLink || this.content.end.url
            } <br><br>\n\n`;
        }

        this.defaultHashtags.forEach(hashtag => {
            description += `#${hashtag} `;
        });

        return description;
    }

    private getTitle() {
        return `[CodeStack News] ${this.content.title} \n\n`;
    }
}
