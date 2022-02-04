import { Command, Flags } from '@oclif/core';

import { CreateConfig } from '../types';

import {
    BundleVideoService,
    CreatePodcastAudioFile,
    CreateThumnailService,
    ExportDataService,
    GetContentService,
    InstagramUploadService,
    RenderVideoService,
    RetrieveAudioDuration,
    TextToSpeechService,
    YoutubeUploadService,
} from '../services';
import { getLatestFileCreated } from '../utils/getFiles';

export default class Create extends Command {
    static description = 'Create video and upload to destination';

    static examples = ['<%= config.bin %> <%= command.id %> youtube -u -t'];

    static flags = {
        filename: Flags.string({
            char: 'f',
            description: 'filename with content',
        }),
        needTTS: Flags.boolean({
            char: 't',
            description:
                "need to create TTS. If you haven't created TTS separately (with option tts), you can set this flag to create along the creation of video",
        }),
        upload: Flags.boolean({
            char: 'u',
            description:
                'should upload result to destination (only works to YouTube and Instagram)',
        }),
        onlyUpload: Flags.boolean({
            description:
                'Only upload result to destination (only works to YouTube and Instagram). Your video should be created separately, placed on tmp folder and be the last file created on it.',
        }),
    };

    static args = [
        {
            name: 'option',
            required: true,
            description: 'Format to create content',
            options: ['youtube', 'instagram', 'tts', 'podcast'],
        },
    ];

    public async run(): Promise<void> {
        const { args, flags } = await this.parse(Create);

        const { filename, needTTS, upload, onlyUpload } = flags;

        switch (args.option) {
            case 'tts':
                await tts({ filename });
                break;
            case 'youtube':
                await youtube({ filename, needTTS, upload, onlyUpload });
                break;
            case 'instagram':
                await instagram({ filename, needTTS, upload, onlyUpload });
                break;
            case 'podcast':
                await podcast({ filename, needTTS });
                break;
        }
    }
}

const tts = async ({ filename }: CreateConfig) => {
    const content = await new GetContentService().execute(filename);

    await new TextToSpeechService(content).execute({
        synthesizeIntro: true,
        synthesizeEnd: true,
    });
};

const youtube = async ({
    filename,
    needTTS,
    onlyUpload,
    upload,
}: CreateConfig) => {
    const content = await new GetContentService().execute(filename);

    if (!onlyUpload) {
        if (needTTS) {
            await new TextToSpeechService(content).execute({
                synthesizeIntro: true,
                synthesizeEnd: true,
            });
        }

        await new RetrieveAudioDuration(content).execute(needTTS || false, {
            haveIntro: true,
            haveEnd: true,
        });

        await new ExportDataService(content).execute('landscape');

        const bundle = await new BundleVideoService().execute();

        await new RenderVideoService(content).execute(
            bundle,
            'landscape',
            true,
            'youtube',
        );

        await new CreateThumnailService(content).execute(bundle);
    }

    if (upload || onlyUpload) {
        const videoPath = await getLatestFileCreated('mp4');
        const thumbnailPath = await getLatestFileCreated('jpeg');

        await new YoutubeUploadService(content).execute(
            videoPath,
            thumbnailPath,
        );
    }
};

const instagram = async ({
    filename,
    needTTS,
    onlyUpload,
    upload,
}: CreateConfig) => {
    const content = await new GetContentService().execute(filename);

    if (!onlyUpload) {
        if (needTTS) {
            await new TextToSpeechService(content).execute({
                synthesizeIntro: false,
                synthesizeEnd: false,
            });
        }

        await new RetrieveAudioDuration(content).execute(needTTS || false, {
            haveIntro: false,
            haveEnd: false,
        });

        await new ExportDataService(content).execute('portrait');

        const bundle = await new BundleVideoService().execute();

        await new RenderVideoService(content).execute(
            bundle,
            'portrait',
            false,
            'instagram',
        );

        await new CreateThumnailService(content).execute(bundle);
    }

    if (upload || onlyUpload) {
        const videoPath = await getLatestFileCreated('mp4');
        const thumbnailPath = await getLatestFileCreated('jpeg');

        await new InstagramUploadService(content).execute(
            videoPath,
            thumbnailPath,
        );
    }
};

const podcast = async ({ filename, needTTS }: CreateConfig) => {
    const content = await new GetContentService().execute(filename);

    if (needTTS) {
        await new TextToSpeechService(content).execute({
            synthesizeIntro: false,
            synthesizeEnd: false,
        });
    }

    await new RetrieveAudioDuration(content).execute(needTTS || false, {
        haveIntro: false,
        haveEnd: false,
    });

    await new ExportDataService(content).execute('square');

    const bundle = await new BundleVideoService().execute();

    await new CreateThumnailService(content).execute(bundle);

    await new CreatePodcastAudioFile(content).execute();
};
