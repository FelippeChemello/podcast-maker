import { getContentFromFile, getLastestFileCreated } from './utils/getFiles';
import {
    CleanTmpService,
    ValidatesContentService,
    InstagramUploadService,
    UrlShortenerService,
    BundleVideoService,
    CreateThumnailService,
    CreateContentTemplateService,
    YoutubeUploadService,
    exportDataService,
    GetContentService,
    RenderVideoService,
    RetrieveAudioDuration,
    TextToSpeechService,
    CreatePodcastAudioFile,
    AnchorFmUploadService,
    MailToJsonService,
} from './services';
import { tmpPath } from './config/defaultPaths';

export const createTTS = async ({
    contentFileName,
}: {
    contentFileName?: string;
}) => {
    const content = new GetContentService().execute(contentFileName);

    await new TextToSpeechService(content).execute({
        synthesizeIntro: true,
        synthesizeEnd: true,
    });
};

export const createYouTube = async ({
    contentFileName,
    needTTS,
}: {
    contentFileName?: string;
    needTTS?: boolean;
}) => {
    const content = new GetContentService().execute(contentFileName);

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

    await new UrlShortenerService(content).execute();

    new exportDataService(content).execute('landscape');

    const bundle = await new BundleVideoService().execute();

    await new RenderVideoService(content).execute(
        bundle,
        'landscape',
        true,
        'youtube',
    );

    await new CreateThumnailService(content).execute(bundle);
};

export const uploadYouTube = async () => {
    const videoPath = getLastestFileCreated('mp4', tmpPath);
    const thumbnailPath = getLastestFileCreated('jpeg', tmpPath);
    const content = JSON.parse(
        getContentFromFile(getLastestFileCreated('json', tmpPath)),
    );

    await new YoutubeUploadService(content).execute(videoPath, thumbnailPath);
};

export const createAndUploadYouTube = async ({
    contentFileName,
    needTTS,
}: {
    contentFileName?: string;
    needTTS?: boolean;
}) => {
    await createYouTube({
        contentFileName,
        needTTS,
    });

    await uploadYouTube();
};

export const createInstagram = async ({
    contentFileName,
    needTTS,
}: {
    contentFileName?: string;
    needTTS?: boolean;
}) => {
    const content = new GetContentService().execute(contentFileName);

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

    new exportDataService(content).execute('portrait');

    const bundle = await new BundleVideoService().execute();

    await new RenderVideoService(content).execute(
        bundle,
        'portrait',
        false,
        'instagram',
    );

    await new CreateThumnailService(content).execute(bundle);
};

export const uploadInstagram = async () => {
    const videoPath = getLastestFileCreated('mp4', tmpPath);
    const thumbnailPath = getLastestFileCreated('jpeg', tmpPath);
    const content = JSON.parse(
        getContentFromFile(getLastestFileCreated('json', tmpPath)),
    );

    await new InstagramUploadService(content).execute(videoPath, thumbnailPath);
};

export const createAndUploadInstagram = async ({
    contentFileName,
    needTTS,
}: {
    contentFileName?: string;
    needTTS?: boolean;
}) => {
    await createInstagram({
        contentFileName,
        needTTS,
    });

    await uploadInstagram();
};

export const createPodcast = async ({
    contentFileName,
    needTTS,
}: {
    contentFileName?: string;
    needTTS?: boolean;
}) => {
    const content = new GetContentService().execute(contentFileName);

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

    await new UrlShortenerService(content).execute();

    new exportDataService(content).execute('square');

    const bundle = await new BundleVideoService().execute();

    await new CreateThumnailService(content).execute(bundle);

    await new CreatePodcastAudioFile(content).execute();
};

export const uploadAnchor = async () => {
    const audioPath = getLastestFileCreated('mp3', tmpPath);
    const thumbnailPath = getLastestFileCreated('jpeg', tmpPath);
    const content = JSON.parse(
        getContentFromFile(getLastestFileCreated('json', tmpPath)),
    );

    await new AnchorFmUploadService(content).execute(audioPath, thumbnailPath);
};

export const createAndUploadAnchor = async ({
    contentFileName,
    needTTS,
}: {
    contentFileName?: string;
    needTTS?: boolean;
}) => {
    await createPodcast({
        contentFileName,
        needTTS,
    });

    await uploadAnchor();
};

export const createNewContent = (name: string) => {
    new CreateContentTemplateService().execute(name);
};

export const mailToContent = async () => {
    await new MailToJsonService().execute();
};

export const validateLatestContent = () => {
    new ValidatesContentService().execute();
};

export const cleanTmp = () => {
    new CleanTmpService().execute();
};
