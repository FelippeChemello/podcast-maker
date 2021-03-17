import fs from 'fs';
import path from 'path';
import os from 'os';
import execa from 'execa';
import { bundle } from '@remotion/bundler';
import {
    getCompositions,
    renderFrames,
    stitchFramesToVideo,
} from '@remotion/renderer';

class RenderVideoService {
    constructor() {}

    public async execute(text: string, sufix: string): Promise<void> {
        const compositionId = 'Main';

        console.log('Montando o bundle');
        const bundled = await bundle(
            require.resolve('../../../../video/src/index'),
        );

        console.log('Pegando comps');
        const compositions = await getCompositions(bundled);

        console.log('Buscando video');
        const video = compositions.find(c => c.id === compositionId);
        if (!video) {
            console.log('Video não encontrado');
            return;
        }

        console.log('Criando tempdir');
        const framesDir = await fs.promises.mkdtemp(
            path.join(os.tmpdir(), 'remotion-'),
        );

        console.log('Iniciando render');
        await renderFrames({
            config: video,
            webpackBundle: bundled,
            onStart: () => console.log('Rendering frames...'),
            onFrameUpdate: f => {
                if (f % 10 === 0) {
                    console.log(`Rendered frame ${f}`);
                }
            },
            parallelism: null,
            outputDir: framesDir,
            userProps: {
                titleText: 'Hello World',
            },
            compositionId,
            imageFormat: 'jpeg',
        });

        console.log('Renderizando video');
        await stitchFramesToVideo({
            dir: framesDir,
            force: true,
            fps: video.fps,
            height: video.height,
            width: video.width,
            imageFormat: 'jpeg',
            outputLocation: path.join(
                __dirname,
                '..',
                '..',
                '..',
                '..',
                'tmp',
                'out.mp4',
            ),
            pixelFormat: 'yuv420p',
            onProgress: frame => void 0,
        });

        console.log(path.join(__dirname, 'out.mp4'));

        console.log('Unindo audio');
        const task = execa(
            'ffmpeg',
            [
                '-i',
                'out.mp4',
                '-i',
                'output-0.mp3',
                '-map',
                '0',
                '-map',
                '1:a',
                '-c:v',
                'copy',
                '-shortest',
                'output.mkv',
            ],
            {
                cwd: path.join(
                    __dirname,
                    '..',
                    '..',
                    '..',
                    '..',
                    'tmp',
                    'out.mp4',
                ),
            },
        );
        // ffmpeg -i video.mkv -i audio.mp3 -map 0 -map 1:a -c:v copy -shortest output.mkv
        // try {
        //     await Promise.all([
        //         fs.promises.rmdir(framesDir, {
        //             recursive: true,
        //         }),
        //         fs.promises.rmdir(bundled, {
        //             recursive: true,
        //         }),
        //     ]);
        // } catch (err) {
        //     console.error('Could not clean up directory.');
        //     console.error(err);
        //     console.log('Do you have minimum required Node.js version?');
        //     process.exit(1);
        // }
    }
}

export default RenderVideoService;
