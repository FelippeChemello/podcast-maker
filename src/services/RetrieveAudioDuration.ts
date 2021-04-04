import fs from 'fs';
import path from 'path';
import mp3Duration from 'mp3-duration';

import { log, error } from '../utils/log';
import { tmpPath } from '../config/defaultPaths';
import InterfaceJsonContent from '../models/InterfaceJsonContent';

export default class RetrieveAudioDuration {
    private transitionDurationInSeconds = 2.9;
    private content: InterfaceJsonContent;

    constructor(content: InterfaceJsonContent) {
        this.content = content;
    }

    public async execute(): Promise<void> {
        if (!this.content.renderData) {
            error('RenderData is undefined', 'RetrieveAudioDuration');
            return;
        }

        for (let i = 0; i < this.content.renderData.length; i++) {
            log(
                `Getting duration of audio-sentence ${i}`,
                'RetrieveAudioDuration',
            );

            const duration = await this.getDuration(
                this.content.renderData[i].audioFilePath,
            );

            this.content.renderData[i].duration = duration;
        }

        this.setFullDuration();
    }

    private async getDuration(path: string): Promise<number> {
        return new Promise(resolve => {
            mp3Duration(path, (err, duration: number) => {
                if (err) {
                    error(
                        `Failed at getting duration of ${path}`,
                        `TextToSpeechService`,
                    );
                }

                resolve(duration);
            });
        });
    }

    private setFullDuration() {
        if (!this.content.renderData) {
            error('RenderData is undefined', 'ExportDataService');
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
                } else {
                    return accumulator + currentValue.duration;
                }
            },
            0,
        );
    }
}
