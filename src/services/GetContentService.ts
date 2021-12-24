import fs from 'fs';
import path from 'path';

import { error, log } from '../utils/log';
import { getLastestFileCreated } from '../utils/getFiles';
import { contentPath } from '../config/defaultPaths';
import InterfaceJsonContent from '../models/InterfaceJsonContent';

export default class GetContentService {
    // eslint-disable-next-line
    public execute(filename?: string): InterfaceJsonContent {
        const contentFilePath = filename
            ? path.resolve(contentPath, filename)
            : getLastestFileCreated('json', contentPath);

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
