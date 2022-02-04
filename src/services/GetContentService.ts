import fs from 'fs';
import path from 'path';

import { error, log } from '../utils/log';
import { getLatestFileCreated } from '../utils/getFiles';
import { getPath } from '../config/defaultPaths';
import InterfaceJsonContent from '../models/InterfaceJsonContent';

export default class GetContentService {
    // eslint-disable-next-line
    public async execute(filename?: string): Promise<InterfaceJsonContent> {
        const contentPath = await getPath('content');
        
        const contentFilePath = filename
            ? path.resolve(contentPath, filename)
            : await getLatestFileCreated('json', contentPath);

        log(`Getting content from ${contentFilePath}`, 'GetContentService');

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
}
