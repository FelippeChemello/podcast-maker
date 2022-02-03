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
            creationTime: fs
                .statSync(path.join(dirPath as string, file))
                .ctime.getTime(),
        }))
        .sort((a, b) => b.creationTime - a.creationTime)
        .pop()?.file;

    if (!mostRecentlyCreatedFile) {
        error(`No ${fileExt} file in ${dirPath}`);
        process.exit(1);
    }

    return path.resolve(dirPath, mostRecentlyCreatedFile);
};
