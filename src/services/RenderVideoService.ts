import fs from 'fs';
import path from 'path';
import {
    getCompositions,
    renderFrames,
    stitchFramesToVideo,
} from '@remotion/renderer';

import InterfaceJsonContent from 'models/InterfaceJsonContent';
import { log, error } from '../utils/log';
import { tmpPath } from '../config/defaultPaths';
import { format } from '../config/destination';
import Bar from '../utils/CliProgress/bar';

class RenderVideoService {
    private content: InterfaceJsonContent;
    private compositionId = 'Main';

    constructor(content: InterfaceJsonContent) {
        this.content = content;
    }

    public async execute(
        bundle: string,
        destination: 'instagram' | 'youtube',
    ): Promise<string> {
        log(`Getting compositions from ${bundle}`, 'RenderVideoService');
        const compositions = await getCompositions(bundle, {
            inputProps: { filename: this.content.timestamp },
        });
        const video = compositions.find(c => c.id === this.compositionId);
        if (!video) {
            error(`Video not found`, 'RenderVideoService');
            return '';
        }

        const framesDir = await fs.promises.mkdtemp(
            path.join(tmpPath, 'frames-'),
        );

        const outputVideoPath = path.resolve(
            tmpPath,
            `${this.content.timestamp}.mp4`,
        );

        log(`Rendering frames`, 'RenderVideoService');

        let renderProgressBar = {} as Bar;

        const { assetsInfo, frameCount, localPort } = await renderFrames({
            config: video,
            webpackBundle: bundle,
            onStart: ({ frameCount }) => {
                renderProgressBar = new Bar({
                    initValue: 0,
                    total: frameCount,
                    text:
                        '[RenderVideoService] Progress {bar} {percentage}% | ETA: {eta}s | {value}/{total} | Rate: {rate}',
                });
            },
            onFrameUpdate: frame => {
                renderProgressBar.update(frame);
            },
            parallelism: null,
            outputDir: framesDir,
            inputProps: {
                filename: this.content.timestamp,
                withoutIntro: destination === 'instagram',
            },
            compositionId: this.compositionId,
            imageFormat: 'jpeg',
        });

        renderProgressBar.stop();

        log(`Stitching frames`, 'RenderVideoService');

        const stitchingProgressBar = new Bar({
            initValue: 0,
            total: frameCount,
            text:
                '[RenderVideoService] Progress {bar} {percentage}% | ETA: {eta}s | {value}/{total} | Rate: {rate}',
        });

        await stitchFramesToVideo({
            dir: framesDir,
            fps: this.content.fps,
            width: format[destination].width,
            height: format[destination].height,
            outputLocation: outputVideoPath,
            force: true,
            imageFormat: 'jpeg',
            assetsInfo,
            localPort,
            onProgress: frame => {
                stitchingProgressBar.update(frame);
            },
        });

        fs.rmdirSync(framesDir, { recursive: true });

        stitchingProgressBar.stop();

        return outputVideoPath;
    }
}

export default RenderVideoService;
