import path from 'path';
import audioConcat from 'audioconcat';

import InterfaceJsonContent from '../models/InterfaceJsonContent';
import { log, error } from '../utils/log';
import { assetsPath, tmpPath } from '../config/defaultPaths';

class CreatePodcastAudioFile {
    private content: InterfaceJsonContent;
    private transitionAudioPath = path.resolve(assetsPath, 'transition.mp3');

    constructor(content: InterfaceJsonContent) {
        this.content = content;
    }

    public async execute(): Promise<void> {
        const audioFiles = this.content.renderData?.map(
            data => data.audioFilePath,
        );

        if (!audioFiles) {
            error('Failed to get audio files', 'CreatePodcastAudioFile');
            process.exit(1);
        }

        const audioFilesWithTransitions = audioFiles
            .map((file, index) => {
                if (index === audioFiles.length - 1) {
                    return [file];
                }

                return [file, this.transitionAudioPath];
            })
            .reduce((acc, array) => acc.concat(array), []);

        await this.concatAudioFiles(audioFilesWithTransitions);
    }

    private concatAudioFiles(audioFilesPath: string[]): Promise<string> {
        return new Promise(resolve => {
            audioConcat(audioFilesPath)
                .concat(path.resolve(tmpPath, `${this.content.timestamp}.mp3`))
                .on('start', (command: string) => {
                    log(
                        'Starting audios concatenation',
                        'CreatePodcastAudioFile',
                        command,
                    );
                })
                .on('error', (err: string, stdout: string, stderr: string) => {
                    error(
                        'Failed at concatenating audio',
                        'CreatePodcastAudioFile',
                        JSON.stringify({ err, stdout, stderr }),
                    );
                })
                .on('end', (files: string) => {
                    log(
                        'Audios concatenation finished',
                        'CreatePodcastAudioFile',
                    );
                    resolve(files);
                });
        });
    }
}

export default CreatePodcastAudioFile;
