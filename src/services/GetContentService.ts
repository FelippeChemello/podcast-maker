import fs from 'fs';
import path from 'path';

import { error, log } from '../utils/log';
import { contentPath } from '../config/defaultPaths';
import InterfaceJsonContent from '../models/InterfaceJsonContent';

export default class GetContentService {
    private fileType = 'json';

    constructor() {}

    public execute(filename?: string): InterfaceJsonContent {
        const contentFilename = filename ? filename : this.getLastCreatedFile();

        log(
            `Getting content from ${contentFilename}.${this.fileType}`,
            'GetContentService',
        );
        const contentFilePath = path.resolve(
            contentPath,
            `${contentFilename}.${this.fileType}`,
        );

        try {
            const content = fs.readFileSync(contentFilePath, {
                encoding: 'utf-8',
            });

            const jsonContent = JSON.parse(content) as InterfaceJsonContent;

            return jsonContent;
        } catch {
            error(`${contentFilePath} not found`, 'GetContentService');
            process.exit();
        }
    }

    private getLastCreatedFile() {
        log('Getting content files', 'GetContentService');

        const files = fs.readdirSync(contentPath);

        const sortedFiles = files
            .map(t => Number(t.split('-')[0]))
            .sort((a, b) => a - b);

        return sortedFiles.pop();
    }
}
