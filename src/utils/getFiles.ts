import fs from 'fs';
import path from 'path';

import { error } from './log';
import { getPath } from '../config/defaultPaths';

export const getLatestFileCreated = async (
    fileExt: string,
    dirPath?: string,
) => {
    if (!dirPath) {
        dirPath = await getPath('tmp');
    }

    const files = fs.readdirSync(dirPath);

    const mostRecentlyCreatedFile = files
        .filter(file => path.extname(file) === `.${fileExt}`)
        .map(file => ({
            file,
            creationTime: Number(file.split('.')[0].split('-')[0]),
        }))
        .filter(file => !Number.isNaN(file.creationTime))
        .sort((a, b) => a.creationTime - b.creationTime)
        .pop()?.file;

    if (!mostRecentlyCreatedFile) {
        error(`No ${fileExt} file in ${dirPath}`);
        process.exit(1);
    }

    return path.resolve(dirPath, mostRecentlyCreatedFile);
};
