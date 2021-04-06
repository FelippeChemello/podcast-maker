import fs from 'fs';
import path from 'path';

import { log } from '../utils/log';
import { tmpPath } from '../config/defaultPaths';
import { format } from '../config/destination';
import InterfaceJsonContent from '../models/InterfaceJsonContent';

export default class ExportDataService {
    private fileType = 'json';
    private content: InterfaceJsonContent;

    constructor(content: InterfaceJsonContent) {
        this.content = content;
    }

    public execute(destination: 'youtube' | 'instagram'): void {
        const dataFilename = `${this.content.timestamp}.${this.fileType}`;

        this.content.width = format[destination].width;
        this.content.height = format[destination].height;

        log(`Exporting data to ${dataFilename}`, 'ExportDataService');
        fs.writeFileSync(
            path.resolve(tmpPath, dataFilename),
            JSON.stringify(this.content),
        );
    }
}
