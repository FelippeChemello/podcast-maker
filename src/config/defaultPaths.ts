import fs from 'fs';
import path from 'path';
import { Config } from '@oclif/core';

const assetsPath = path.resolve(__dirname, '..', '..', 'assets');
const remotionPath = path.resolve(__dirname, '..', '..', 'video');

export const getPath = async (
    pathname: 'content' | 'assets' | 'tmp' | 'remotion',
) => {
    const config = await Config.load();

    switch (pathname) {
        case 'content':
            const contentPath = path.resolve(config.dataDir, 'content');

            if (!fs.existsSync(contentPath)) {
                fs.mkdirSync(contentPath, { recursive: true });
            }

            return contentPath;
        case 'assets':
            return assetsPath;
        case 'tmp':
            const tmpPath = path.resolve(config.cacheDir, 'tmp');

            if (!fs.existsSync(tmpPath)) {
                fs.mkdirSync(tmpPath, { recursive: true });
            }

            return tmpPath;
        case 'remotion':
            return remotionPath;
        default:
            throw new Error(`Unknown path: ${pathname}`);
    }
};
