import fs from 'fs';
import path from 'path';
import { getCompositions, renderFrames } from '@remotion/renderer';

import InterfaceJsonContent from 'models/InterfaceJsonContent';
import { log, error } from '../utils/log';
import { tmpPath } from '../config/defaultPaths';

export default class CreateThumnailService {
    private content: InterfaceJsonContent;
    private compositionId = 'Thumbnail';

    constructor(content: InterfaceJsonContent) {
        this.content = content;
    }

    public async execute(bundle: string): Promise<string> {
        log(`Getting compositions from ${bundle}`, 'CreateThumnailService');
        const compositions = await getCompositions(bundle, {
            inputProps: { filename: this.content.timestamp },
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
            inputProps: { filename: this.content.timestamp },
            compositionId: this.compositionId,
            imageFormat: 'jpeg',
        });

        fs.renameSync(path.resolve(tmpPath, 'element-0.jpeg'), thumbnailPath);

        return thumbnailPath;
    }
}
