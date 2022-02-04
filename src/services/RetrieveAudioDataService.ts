import fs from 'fs';
import path from 'path';
import mp3Duration from 'mp3-duration';

import { log, error } from '../utils/log';
import { getPath } from '../config/defaultPaths';
import InterfaceJsonContent from '../models/InterfaceJsonContent';

export default class RetrieveAudioDataService {
    private transitionDurationInSeconds = 2.9;
    private content: InterfaceJsonContent;

    constructor(content: InterfaceJsonContent) {
        this.content = content;
    }

    public async execute(
        audioDataIsInContent: boolean,
        options: { haveIntro?: boolean; haveEnd?: boolean },
    ): Promise<void> {
        if (!audioDataIsInContent) {
            await this.retrieveAudioData(
                options.haveIntro || false,
                options.haveEnd || false,
            );
        }

        if (!this.content.renderData) {
            error('RenderData is undefined', 'RetrieveAudioDataService');
            return;
        }

        for (let i = 0; i < this.content.renderData.length; i++) {
            log(
                `Getting duration of audio-sentence ${path.basename(
                    this.content.renderData[i].audioFilePath,
                )}`,
                'RetrieveAudioDataService',
            );

            const duration = await this.getDuration(
                this.content.renderData[i].audioFilePath,
            );

            this.content.renderData[i].duration = duration;
        }

        this.setFullDuration();
    }

    private async retrieveAudioData(haveIntro: boolean, haveEnd: boolean) {
        log(
            'Getting data from audio files in tmp/',
            'RetrieveAudioDataService',
        );

        const tmpPath = await getPath('tmp');

        const files = fs.readdirSync(tmpPath);
        const introFilePath = 'output-intro.mp3';
        const endFilePath = 'output-end.mp3';

        const introAndEndFilesRegExp = new RegExp('-intro.*|-end.*');
        const sortedNewsFiles = files
            .filter(
                file =>
                    path.extname(file) === '.mp3' &&
                    !file.match(introAndEndFilesRegExp),
            )
            .map(file => Number(file.split('-')[1].split('.')[0]))
            .sort((a, b) => a - b)
            .map(fileNumber => {
                const fileRegExp = new RegExp(`-${fileNumber}.mp3`);
                return files.find(file => file.match(fileRegExp));
            });

        if (
            typeof sortedNewsFiles === 'undefined' ||
            sortedNewsFiles.length <= 0
        ) {
            error("Couldn't not find audio files", 'RetrieveAudioDataService');
        }

        if (typeof this.content.renderData === 'undefined') {
            this.content.renderData = [];
        }

        if (
            haveIntro &&
            fs.existsSync(path.resolve(tmpPath, introFilePath)) &&
            this.content.intro?.text
        ) {
            this.content.renderData.push({
                text: this.content.intro.text,
                duration: 0,
                audioFilePath: path.resolve(tmpPath, introFilePath),
            });
        }

        for (let i = 0; i < this.content.news.length; i++) {
            this.content.renderData.push({
                text: this.content.news[i].text,
                duration: 0,
                audioFilePath: path.resolve(
                    tmpPath,
                    sortedNewsFiles[i] as string,
                ),
            });
        }

        if (
            haveEnd &&
            fs.existsSync(path.resolve(tmpPath, endFilePath)) &&
            this.content.end?.text
        ) {
            this.content.renderData.push({
                text: this.content.end.text,
                duration: 0,
                audioFilePath: path.resolve(tmpPath, endFilePath),
            });
        }

        console.log(this.content);
    }

    private async getDuration(filePath: string): Promise<number> {
        return new Promise(resolve => {
            mp3Duration(filePath, (err, duration: number) => {
                if (err) {
                    error(
                        `Failed at getting duration of ${filePath}`,
                        `RetrieveAudioDataService`,
                    );
                }

                resolve(duration);
            });
        });
    }

    private setFullDuration() {
        if (!this.content.renderData) {
            error('RenderData is undefined', 'RetrieveAudioDataService');
            return;
        }

        this.content.fullDuration = this.content.renderData.reduce(
            (accumulator, currentValue, index) => {
                if (
                    !this.content.renderData ||
                    index !== this.content.renderData.length - 1
                ) {
                    return (
                        accumulator +
                        currentValue.duration +
                        this.transitionDurationInSeconds
                    );
                }

                return accumulator + currentValue.duration;
            },
            0,
        );
    }
}
