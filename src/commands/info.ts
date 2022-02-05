import { Command, Flags } from '@oclif/core';

import { getPath } from '../config/defaultPaths';

export default class Info extends Command {
    static description = 'Get info about the CLI';

    static examples = [
        '<%= config.bin %> <%= command.id %>',
        '<%= config.bin %> <%= command.id %>',
        '<%= config.bin %> <%= command.id %>',
    ];

    static flags = {
        dir: Flags.boolean({
            char: 'd',
            description: 'Get content directory path',
        }),
    };

    static args = [
        {
            name: 'about',
            required: true,
            description: 'About what you want infos?',
            options: ['content', 'tmp'],
        },
    ];

    public async run(): Promise<void> {
        const {
            args,
            flags: { dir },
        } = await this.parse(Info);

        switch (args.about) {
            case 'content':
                if (dir) {
                    this.log(await getPath('content'));
                }
                break;
            case 'tmp':
                if (dir) {
                    this.log(await getPath('tmp'));
                }
                break;
        }

        this.config;
    }
}
