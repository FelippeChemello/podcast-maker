import fs from 'fs';
import path from 'path';

import { error, log } from '../utils/log';
import { tmpPath } from '../config/defaultPaths';
import InterfaceJsonContent from '../models/InterfaceJsonContent';

export default class ExportDataService {
    private fileType = 'json';
    private content: InterfaceJsonContent;
    private transitionDurationInSecounds = 2.9;

    constructor(content: InterfaceJsonContent) {
        this.content = content;
    }

    public execute(): void {
        const dataFilename = `${this.content.timestamp}.${this.fileType}`;

        this.setFullDuration();

        log(`Exporting data to ${dataFilename}`, 'ExportDataService');
        fs.writeFileSync(
            path.resolve(tmpPath, dataFilename),
            JSON.stringify(this.content),
        );
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
                        this.transitionDurationInSecounds
                    );
                } else {
                    return accumulator + currentValue.duration;
                }
            },
            0,
        );
    }
}
