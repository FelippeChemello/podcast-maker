import fs from 'fs';
import path from 'path';
import { getCompositions, renderFrames } from '@remotion/renderer';

import InterfaceJsonContent from '../models/InterfaceJsonContent';
import { log, error } from '../utils/log';
import { getPath } from '../config/defaultPaths';
import format from '../config/format';

export default class CreateThumnailService {
    private content: InterfaceJsonContent;
    private compositionId = 'Thumbnail';

    constructor(content: InterfaceJsonContent) {
        this.content = content;
    }

    public async execute(bundle: string, videoFormat: 'portrait' | 'landscape' | 'square' = 'portrait'): Promise<string> {
        log(`Getting compositions from ${bundle}`, 'CreateThumnailService');
        const tmpPath = await getPath('tmp');

        const compositions = await getCompositions(bundle, {
            inputProps: { filename: `${this.content.timestamp}.json`, tmpPath },
        });
        const video = compositions.find(c => c.id === this.compositionId);
        if (!video) {
            error(`Video not found`, 'RenderVideoService');
            return '';
        }

        const thumbnailPath = path.resolve(
            tmpPath,
            `${this.content.timestamp}.jpeg`,
        );

        log(`Starting render process`, 'CreateThumnailService');

        await renderFrames({
            config: video,
            webpackBundle: bundle,
            onStart: () => log(`Starting rendering`, 'CreateThumnailService'),
            onFrameUpdate: frame =>
                log(`Rendered frame ${frame}`, 'CreateThumnailService'),
            parallelism: null,
            outputDir: tmpPath,
            inputProps: { filename: `${this.content.timestamp}.json` },
            composition: {
                id: this.compositionId,
                durationInFrames: 1,
                fps: this.content.fps,
                height: format[videoFormat].height,
                width: format[videoFormat].width,
            },
            imageFormat: 'jpeg',
        });

        fs.renameSync(path.resolve(tmpPath, 'element-0.jpeg'), thumbnailPath);

        return thumbnailPath;
    }
}
