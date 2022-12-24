import os from 'os'
import path from 'path';
import {
    getCompositions,
    renderMedia,
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

        const outputVideoPath = path.resolve(
            tmpPath,
            `${this.content.timestamp}.mp4`,
        );

        log(`Rendering frames with concurrency of ${os.cpus().length} frames`, 'RenderVideoService');

        const renderProgressBar = new Bar({
            initValue: 0,
            text: '[RenderVideoService] Progress {bar} {percentage}% | ETA: {eta}s | {value}/{total} | Rate: {rate} | Stage: {stage}',
        });

        await renderMedia({
            webpackBundle: bundle,
            onStart: ({ frameCount: total }) => {
                renderProgressBar.setTotal(total);
            },
            onProgress: ({ renderedFrames, encodedFrames, stitchStage, renderedDoneIn }) => {
                renderProgressBar.update(renderedDoneIn ? encodedFrames : renderedFrames, { stage: !renderedDoneIn ? 'rendering' : stitchStage })
            },
            parallelism: null,
            outputLocation: outputVideoPath,
            inputProps: {
                filename: `${this.content.timestamp}.json`,
                withoutIntro: !withIntro,
                destination,
                tmpPath,
            },
            composition: {
                id: this.compositionId,
                durationInFrames: Math.floor((this.content.fullDuration || 1) * this.content.fps),
                fps: this.content.fps,
                width: format[videoFormat].width,
                height: format[videoFormat].height,
            },
            imageFormat: 'jpeg',
            codec: 'h264',
            verbose: true,
            disallowParallelEncoding: true,
        });

        renderProgressBar.stop();

        return outputVideoPath;
    }
}

export default RenderVideoService;
