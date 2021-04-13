import fs from 'fs';
import path from 'path';

import { error } from './log';

export const getLastestFileCreated = (fileExt: string, dirPath: string) => {
    const files = fs.readdirSync(dirPath);

    const fileTimestamp = files
        .filter(file => path.extname(file) === `.${fileExt}`)
        .map(file => file.split('.')[0])
        .map(file => Number(file.split('-')[0]))
        .filter(file => !Number.isNaN(file))
        .sort((a, b) => a - b)
        .pop();

    const fileRegExp = new RegExp(`${fileTimestamp}.*.${fileExt}`, 'ig');

    const fullFileName = files.find(file => file.match(fileRegExp));
    if (!fullFileName) {
        error(`Could not find ${fileExt} file in ${dirPath}`, 'getFiles');
        process.exit(1);
    }

    return path.resolve(dirPath, fullFileName);
};

export const getContentFromFile = (filePath: string) => {
    const data = fs.readFileSync(filePath, { encoding: 'utf-8' });

    if (!data) {
        error(`Could not find file ${filePath}`, 'getFiles');
        process.exit(1);
    }

    return data;
};
