import fs from 'fs';
import path from 'path';
import {
    getCompositions,
    renderFrames,
    stitchFramesToVideo,
} from '@remotion/renderer';

import InterfaceJsonContent from '../models/InterfaceJsonContent';
import { log, error } from '../utils/log';
import { getPath } from '../config/defaultPaths';
import format from '../config/format';
import Bar from '../utils/CliProgress/bar';

class RenderVideoService {
    private content: InterfaceJsonContent;
    private compositionId = 'Main';

    constructor(content: InterfaceJsonContent) {
        this.content = content;
    }

    public async execute(
        bundle: string,
        videoFormat: 'portrait' | 'landscape' | 'square',
        withIntro: boolean,
        destination?: 'youtube' | 'instagram',
    ): Promise<string> {
        log(`Getting compositions from ${bundle}`, 'RenderVideoService');
        const tmpPath = await getPath('tmp');

        const compositions = await getCompositions(bundle, {
            inputProps: {
                filename: `${this.content.timestamp}.json`,
                tmpPath,
            },
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

        const { assetsInfo, frameCount } = await renderFrames({
            config: video,
            webpackBundle: bundle,
            onStart: ({ frameCount: total }) => {
                renderProgressBar = new Bar({
                    initValue: 0,
                    total,
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
                filename: `${this.content.timestamp}.json`,
                withoutIntro: !withIntro,
                destination,
                tmpPath,
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
            width: format[videoFormat].width,
            height: format[videoFormat].height,
            outputLocation: outputVideoPath,
            force: true,
            imageFormat: 'jpeg',
            assetsInfo,
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
