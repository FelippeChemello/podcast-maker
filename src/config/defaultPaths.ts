import fs from 'fs';
import path from 'path';
import { Config } from '@oclif/core';

import { log } from '../utils/log';

const assetsPath = path.resolve(__dirname, '..', '..', 'assets');
const remotionPath = path.resolve(__dirname, '..', '..', 'video');

export const getPath = async (
    pathname: 'content' | 'assets' | 'tmp' | 'remotion',
) => {
    const config = await Config.load();

    switch (pathname) {
        case 'content':
            const contentPath = path.resolve(config.dataDir, 'content');
            log(`Content path: ${contentPath}`, 'getPath');

            if (!fs.existsSync(contentPath)) {
                log(
                    `Content path doesn't exist: ${contentPath}. Creating...`,
                    'getPath',
                );

                fs.mkdirSync(contentPath, { recursive: true });
            }

            return contentPath;
        case 'assets':
            log(`Assets path: ${assetsPath}`, 'getPath');

            return assetsPath;
        case 'tmp':
            const tmpPath = path.resolve(config.cacheDir, 'tmp');
            log(`Tmp path: ${tmpPath}`, 'getPath');

            if (!fs.existsSync(tmpPath)) {
                log(
                    `Tmp path doesn't exist: ${tmpPath}. Creating...`,
                    'getPath',
                );

                fs.mkdirSync(tmpPath, { recursive: true });
            }

            return tmpPath;
        case 'remotion':
            log(`Remotion path: ${remotionPath}`, 'getPath');

            return remotionPath;
        default:
            throw new Error(`Unknown path: ${pathname}`);
    }
};
