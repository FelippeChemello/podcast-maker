require('dotenv').config();
import { Command } from 'commander';

import { error, log } from './utils/log';
import GetContentService from './services/GetContentService';
import TextToSpeechService from './services/TextToSpeechService';
import RetrieveAudioDuration from './services/RetrieveAudioDataService';
import exportDataService from './services/ExportDataService';
import RenderVideoService from './services/RenderVideoService';
import YoutubeUploadService from './services/YoutubeUploadService';
import CreateThumnailService from './services/CreateThumnailService';
import BundleVideoService from './services/BundleVideoService';
import CreateContentTemplateService from './services/CreateContentTemplateService';
import UrlShortenerService from './services/UrlShortenerService';
import CleanTmpService from './services/CleanTmpService';
import InstagramUploadService from './services/InstagramUploadService';
import ValidatesContentService from './services/ValidatesContentService';

// Adicionar minutagem das noticias
// Fazer upload para anchor.fm
// WIP: Fazer upload para Instagram automaticamente

const create = async ({
    contentFileName,
    destination,
    onlyTTS,
    noNeedTTS,
}: {
    contentFileName?: string;
    destination: 'youtube' | 'instagram';
    onlyTTS: boolean;
    noNeedTTS: boolean;
}) => {
    const beginTime = Date.now();

    const content = new GetContentService().execute(contentFileName);

    if (!noNeedTTS) {
        await new TextToSpeechService(content).execute(destination);
    }

    if (onlyTTS) {
        log(
            `TTS audio files created in ${Math.round(
                (Date.now() - beginTime) / 1000,
            )} seconds`,
            'Main',
        );
        process.exit(0);
    }

    await new RetrieveAudioDuration(content).execute(noNeedTTS, destination);

    if (destination === 'youtube') {
        await new UrlShortenerService(content).execute();
    }

    new exportDataService(content).execute(destination);

    const bundle = await new BundleVideoService().execute();

    const videoPath = await new RenderVideoService(content).execute(
        bundle,
        destination,
    );

    const thumbnailPath = await new CreateThumnailService(content).execute(
        bundle,
    );

    if (destination === 'youtube') {
        await new YoutubeUploadService(content).execute(
            videoPath,
            thumbnailPath,
        );
    }

    if (destination === 'instagram') {
        await new InstagramUploadService(content).execute(
            videoPath,
            thumbnailPath,
        );
    }

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
        '-d, --destination <destination>',
        'Set destination of video. \nOptions: youtube or instagram.',
        'youtube',
    )
    .option('-tts, --onlyTTS', 'Only create TTS audio files', false)
    .option(
        '-ntts, --noNeedTTS',
        'If TTS audio files has already been created and it is placed in `tmp/`, set it param',
        false,
    )
    .option(
        '-c, --create <description>',
        'Create new content file with default labels',
    )
    .option(
        '-v, --validate',
        'Validates if all necessary labels in last content was filled',
    )
    .option('-rm, --clean', 'Clean tmp dir')
    .option('-vf, --fps', 'Set video FPS')
    .parse(process.argv);

const options = program.opts();

if (Object.keys(options).length <= 0) {
    error('No options selected');
}

if (options.build) {
    create({
        contentFileName: options.file,
        destination: options.destination,
        onlyTTS: options.onlyTTS,
        noNeedTTS: options.noNeedTTS,
    });
}

if (options.create) {
    new CreateContentTemplateService().execute(options.create, {
        fps: options.fps,
    });
}

if (options.validate) {
    new ValidatesContentService().execute();
}

if (options.clean) {
    new CleanTmpService().execute();
}
