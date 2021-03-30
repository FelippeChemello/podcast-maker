require('dotenv').config();

import GetContentService from './services/GetContentService';
import TextToSpeechService from './services/TextToSpeechService';
import RetrieveAudioDuration from './services/RetrieveAudioDuration';
import exportDataService from './services/ExportDataService';
import RenderVideoService from './services/RenderVideoService';
import { log } from './utils/log';

const execute = async () => {
    let content = new GetContentService().execute();

    await new TextToSpeechService(content).execute();

    await new RetrieveAudioDuration(content).execute();

    new exportDataService(content).execute();

    await new RenderVideoService(content).execute();

    log('Podcast finished', 'Main');
    process.exit(0);
};

execute();
