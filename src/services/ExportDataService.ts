import fs from 'fs';
import path from 'path';

import { log } from '../utils/log';
import { getPath } from '../config/defaultPaths';
import format from '../config/format';
import InterfaceJsonContent from '../models/InterfaceJsonContent';

export default class ExportDataService {
    private fileType = 'json';
    private content: InterfaceJsonContent;

    constructor(content: InterfaceJsonContent) {
        this.content = content;
    }

    public async execute(videoFormat: 'portrait' | 'landscape' | 'square') {
        const dataFilename = `${this.content.timestamp}.${this.fileType}`;

        this.content.width = format[videoFormat].width;
        this.content.height = format[videoFormat].height;

        log(`Exporting data to ${dataFilename}`, 'ExportDataService');

        fs.writeFileSync(
            path.resolve(await getPath('tmp'), dataFilename),
            JSON.stringify(this.content),
        );
    }
}
