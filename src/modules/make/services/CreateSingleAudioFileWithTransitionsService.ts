import fs from 'fs';
import path from 'path';
import os from 'os';
import { bundle } from '@remotion/bundler';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import ffmpeg from 'fluent-ffmpeg';
import audioconcat from 'audioconcat';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

const transitionPath = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    'assets',
    'transition.mp3',
);

class CreateSingleAudioFileWithTransitionsService {
    constructor() {}

    public async execute(audioPaths: string[]): Promise<void> {
        return new Promise((resolve, reject) => {
            const pathsWithTransitions2d = audioPaths.map((path, index) => {
                return [
                    path,
                    index < audioPaths.length - 1 ? transitionPath : '',
                ];
            });

            //Convert 2d array for 1d
            const pathsWithTransitions = [].concat.apply(
                [],
                pathsWithTransitions2d as any,
            );

            const outputFile = path.resolve(
                __dirname,
                '..',
                '..',
                '..',
                '..',
                'tmp',
                'output-final.mp3',
            );
            audioconcat(pathsWithTransitions)
                .concat(outputFile)
                .on('start', function (command) {
                    console.log('ffmpeg process started:', command);
                })
                .on('error', function (err, stdout, stderr) {
                    console.error('Error:', err);
                    console.error('ffmpeg stderr:', stderr);
                })
                .on('end', function (output) {
                    console.error('Audio created in:', output);
                    resolve();
                });
        });
    }
}

export default CreateSingleAudioFileWithTransitionsService;
