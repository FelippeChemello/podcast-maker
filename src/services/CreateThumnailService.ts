import fs from 'fs';
import path from 'path';
import { renderStill } from '@remotion/renderer';

import InterfaceJsonContent from '../models/InterfaceJsonContent';
import { log } from '../utils/log';
import { getPath } from '../config/defaultPaths';
import format from '../config/format';

export default class CreateThumbnailService {
    private content: InterfaceJsonContent;
    private compositionId = 'Thumbnail';

    constructor(content: InterfaceJsonContent) {
        this.content = content;
    }

    public async execute(bundle: string, videoFormat: 'portrait' | 'landscape' | 'square' = 'landscape'): Promise<string> {
        log(`Getting compositions from ${bundle}`, 'CreateThumnailService');
        const tmpPath = await getPath('tmp');

        const thumbnailPath = path.resolve(
            tmpPath,
            `${this.content.timestamp}.jpeg`,
        );

        log(`Starting render process`, 'CreateThumnailService');

        await renderStill({
            serveUrl: bundle,
            output: thumbnailPath,
            inputProps: {
                content: this.content,
                destination: 'youtube',
                durationInFrames: 1,
            },
            composition: {
                id: this.compositionId,
                durationInFrames: 1,
                fps: this.content.fps,
                height: format[videoFormat].height,
                width: format[videoFormat].width,
            },
            imageFormat: 'jpeg',
        });

        return thumbnailPath;
    }
}
