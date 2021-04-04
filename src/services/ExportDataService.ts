import fs from 'fs';
import path from 'path';

import { error, log } from '../utils/log';
import { tmpPath } from '../config/defaultPaths';
import InterfaceJsonContent from '../models/InterfaceJsonContent';

export default class ExportDataService {
    private fileType = 'json';
    private content: InterfaceJsonContent;

    constructor(content: InterfaceJsonContent) {
        this.content = content;
    }

    public execute(): void {
        const dataFilename = `${this.content.timestamp}.${this.fileType}`;

        log(`Exporting data to ${dataFilename}`, 'ExportDataService');
        fs.writeFileSync(
            path.resolve(tmpPath, dataFilename),
            JSON.stringify(this.content),
        );
    }
}
