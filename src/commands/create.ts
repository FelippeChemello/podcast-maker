import { Command, Flags } from '@oclif/core';

import { CreateConfig } from '../types';

import {
    BundleVideoService,
    CreateThumnailService,
    ExportDataService,
    GetContentService,
    GetYoutubeinfoService,
    InstagramUploadService,
    RenderVideoService,
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
            options: ['youtube', 'instagram', 'tts'],
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
        }
    }
}

const tts = async ({ filename }: CreateConfig) => {
    const { content, file } = await new GetContentService().execute(filename);

    const contentWithAudio = await new TextToSpeechService(content).execute({
        synthesizeIntro: true,
        synthesizeEnd: true,
    });

    await new ExportDataService(contentWithAudio).execute(file);
};

const youtube = async ({
    filename,
    needTTS,
    onlyUpload,
    upload,
}: CreateConfig) => {
    let { content, file } = await new GetContentService().execute(filename, 'landscape');

    if (!onlyUpload) {
        if (needTTS) {
            content = await new TextToSpeechService(content).execute({
                synthesizeIntro: true,
                synthesizeEnd: true,
            });
        }

        content = await new GetYoutubeinfoService(content).execute();

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

    await new ExportDataService(content).execute(file);
};

const instagram = async ({
    filename,
    needTTS,
    onlyUpload,
    upload,
}: CreateConfig) => {
    let { content, file } = await new GetContentService().execute(filename, 'portrait');

    if (!onlyUpload) {
        if (needTTS) {
            content = await new TextToSpeechService(content).execute({
                synthesizeIntro: false,
                synthesizeEnd: false,
            });
        }

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

    await new ExportDataService(content).execute(file);
};
