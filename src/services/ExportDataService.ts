import fs from 'fs';
import path from 'path';

import { log } from '../utils/log';
import { tmpPath } from '../config/defaultPaths';
import { type as os } from '../config/os';
import format from '../config/format';
import InterfaceJsonContent from '../models/InterfaceJsonContent';

export default class ExportDataService {
    private fileType = 'json';
    private content: InterfaceJsonContent;

    constructor(content: InterfaceJsonContent) {
        this.content = content;
    }

    public execute(videoFormat: 'portrait' | 'landscape' | 'square'): void {
        const dataFilename = `${this.content.timestamp}.${this.fileType}`;

        this.content.width = format[videoFormat].width;
        this.content.height = format[videoFormat].height;

        log(`Exporting data to ${dataFilename}`, 'ExportDataService');

        if (os === 'Windows') {
            this.content.renderData?.forEach((news, index) => {
                if (!this.content.renderData?.[index]) {
                    return;
                }

                this.content.renderData[index].audioFilePath =
                    news.audioFilePath.replace(/\\+/g, '/');
            });
        }

        fs.writeFileSync(
            path.resolve(tmpPath, dataFilename),
            JSON.stringify(this.content),
        );
    }
}
