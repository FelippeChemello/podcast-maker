require('dotenv').config();
import { Command } from 'commander';

import GetContentService from './services/GetContentService';
import TextToSpeechService from './services/TextToSpeechService';
import RetrieveAudioDuration from './services/RetrieveAudioDuration';
import exportDataService from './services/ExportDataService';
import RenderVideoService from './services/RenderVideoService';
import YoutubeUploadService from './services/YoutubeUploadService';
import CreateThumnailService from './services/CreateThumnailService';
import BundleVideoService from './services/BundleVideoService';
import CreateContentTemplateService from './services/CreateContentTemplateService';
import UrlShortenerService from './services/UrlShortenerService';
import CleanTmpService from './services/CleanTmpService';
import { error, log } from './utils/log';

const create = async (contentFileName?: string) => {
    const beginTime = Date.now();

    const content = new GetContentService().execute(contentFileName);

    await new UrlShortenerService(content).execute();

    await new TextToSpeechService(content).execute();

    await new RetrieveAudioDuration(content).execute();

    new exportDataService(content).execute();

    const bundle = await new BundleVideoService().execute();

    const videoPath = await new RenderVideoService(content).execute(bundle);

    const thumbnailPath = await new CreateThumnailService(content).execute(
        bundle,
    );

    await new YoutubeUploadService(content).execute(videoPath, thumbnailPath);

    log(
        `Podcast created in ${Math.round(
            (Date.now() - beginTime) / 1000,
        )} seconds`,
        'Main',
    );
    process.exit(0);
};

const program = new Command();
program
    .option('-b, --build', 'Create video and upload to YouTube')
    .option('-f, --file <filename>', 'Define content file to build video')
    .option(
        '-c, --create <description>',
        'Create new content file with default labels',
    )
    .option('-rm, --clean', 'Clean tmp dir')
    .option('-vh, --height', 'Set video height')
    .option('-vw, --width', 'Set video width')
    .option('-vf, --fps', 'Set video FPS')
    .parse(process.argv);

const options = program.opts();

if (Object.keys(options).length <= 0) {
    error('No options selected');
}

if (options.build) {
    create(options.file);
}

if (options.create) {
    new CreateContentTemplateService().execute(options.create, {
        fps: options.fps,
        height: options.height,
        width: options.width,
    });
}

if (options.clean) {
    new CleanTmpService().execute();
}
