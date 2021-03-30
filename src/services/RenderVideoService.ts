import fs from 'fs';
import path from 'path';
import { bundle } from '@remotion/bundler';
import {
    getCompositions,
    renderFrames,
    stitchFramesToVideo,
} from '@remotion/renderer';

import InterfaceJsonContent from 'models/InterfaceJsonContent';
import { log, error } from '../utils/log';
import { tmpPath, remotionPath } from '../config/defaultPaths';

class RenderVideoService {
    private content: InterfaceJsonContent;
    private compositionId = 'Main';

    constructor(content: InterfaceJsonContent) {
        this.content = content;
    }

    public async execute(): Promise<void> {
        log(`Bundling video`, 'RenderVideoService');
        const bundled = await bundle(
            require.resolve(path.resolve(remotionPath, 'src', 'index')),
        );

        log(`Getting compositions`, 'RenderVideoService');
        const compositions = await getCompositions(bundled);
        const video = compositions.find(c => c.id === this.compositionId);
        if (!video) {
            error(`Video not found`, 'RenderVideoService');
            return;
        }

        const framesDir = path.join(tmpPath, 'frames');
        await fs.promises.mkdir(framesDir);

        log(`Starting render process`, 'RenderVideoService');
        const { assetsInfo, frameCount, localPort } = await renderFrames({
            config: video,
            webpackBundle: bundled,
            onStart: () => log(`Rendering frames`, 'RenderVideoService'),
            onFrameUpdate: f => {
                if (f % 10 === 0) {
                    log(`Rendered frame ${f}`, 'RenderVideoService');
                }
            },
            parallelism: null,
            outputDir: framesDir,
            inputProps: { filename: this.content.timestamp },
            compositionId: this.compositionId,
            imageFormat: 'jpeg',
        });

        console.log(frameCount);

        log(`Stitching frames`, 'RenderVideoService');
        await stitchFramesToVideo({
            dir: framesDir,
            fps: this.content.fps,
            width: this.content.width,
            height: this.content.height,
            outputLocation: path.resolve(tmpPath, 'out.mp4'),
            force: true,
            imageFormat: 'jpeg',
            assetsInfo,
            localPort,
        });
    }
}

export default RenderVideoService;
