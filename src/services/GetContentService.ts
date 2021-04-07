import fs from 'fs';
import path from 'path';

import { error, log } from '../utils/log';
import { contentPath } from '../config/defaultPaths';
import InterfaceJsonContent from '../models/InterfaceJsonContent';

export default class GetContentService {
    constructor() {}

    public execute(filename?: string): InterfaceJsonContent {
        const contentFilename = filename ? filename : this.getLastCreatedFile();

        log(`Getting content from ${contentFilename}`, 'GetContentService');
        const contentFilePath = path.resolve(contentPath, contentFilename);

        try {
            const content = fs.readFileSync(contentFilePath, {
                encoding: 'utf-8',
            });

            const jsonContent = JSON.parse(content) as InterfaceJsonContent;

            return jsonContent;
        } catch {
            error(`${contentFilePath} not found`, 'GetContentService');
            process.exit(1);
        }
    }

    private getLastCreatedFile() {
        log('Getting content files', 'GetContentService');

        const files = fs.readdirSync(contentPath);

        const sortedFiles = files
            .map(t => Number(t.split('-')[0]))
            .sort((a, b) => a - b);

        const latestTimestamp = sortedFiles.pop();
        const fileRegExp = new RegExp(`${latestTimestamp}.*`, 'ig');

        const latestCreatedFilename = files.find(file =>
            file.match(fileRegExp),
        );

        if (!latestCreatedFilename) {
            error('Could not find latest file content', 'GetContentService');
            return '';
        }

        return latestCreatedFilename;
    }
}
