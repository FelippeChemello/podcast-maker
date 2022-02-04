import { Command, CliUx } from '@oclif/core';
import { which, ln } from 'shelljs';

import { saveSecrets } from '../config/secrets';

export default class Configure extends Command {
    static description = 'Configure CLI for first usage';

    static examples = ['<%= config.bin %> <%= command.id %>'];

    public async run(): Promise<void> {
        const { prompt, confirm } = CliUx.ux;

        const envs = {
            DEBUG: 0,
            AZURE_TTS_KEY: '',
            AZURE_TTS_REGION: '',
            GOOGLE_CLIENT_ID: '',
            GOOGLE_CLIENT_SECRET: '',
            GOOGLE_REFRESH_TOKEN: '',
            YOUTUBE_REFRESH_TOKEN: '',
            CHROME_BIN: '',
            INSTAGRAM_EMAIL: '',
            INSTAGRAM_PASSWORD: '',
        };

        if (await confirm('Do you wanna configure TTS service?  [y/n]')) {
            envs.AZURE_TTS_KEY = await prompt('Azure TTS key', {
                required: true,
                type: 'mask',
            });
            envs.AZURE_TTS_REGION = await prompt('Azure region', {
                required: true,
            });
        }

        if (
            await confirm(
                'Do you wanna configure YouTube and Mail services?  [y/n]',
            )
        ) {
            envs.GOOGLE_CLIENT_ID = await prompt('Google client ID', {
                required: true,
            });
            envs.GOOGLE_CLIENT_SECRET = await prompt('Google client secret', {
                required: true,
                type: 'mask',
            });
            envs.GOOGLE_REFRESH_TOKEN = await prompt('Gmail refresh token', {
                required: true,
                type: 'mask',
            });
            envs.YOUTUBE_REFRESH_TOKEN = await prompt('Youtube refresh token', {
                required: true,
                type: 'mask',
            });
        }

        if (await confirm('Do you wanna configure Instagram service?  [y/n]')) {
            envs.CHROME_BIN =
                which('google-chrome') ||
                (await prompt('Full path to chrome binary', {
                    required: true,
                }));

            envs.INSTAGRAM_EMAIL = await prompt('Instagram email', {
                required: true,
            });
            envs.INSTAGRAM_PASSWORD = await prompt('Instagram password', {
                required: true,
                type: 'hide',
            });
        }

        envs.DEBUG = Number(
            await confirm('Do you wanna enable debug mode?  [y/n]'),
        );

        await saveSecrets(envs);
    }
}
