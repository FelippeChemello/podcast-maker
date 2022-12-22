import { Command, Flags } from '@oclif/core';
import shell from 'shelljs';

export default class Remotion extends Command {
    static description = 'Remotion framework related commands';

    static examples = [
        '<%= config.bin %> <%= command.id %> upgrade',
        '<%= config.bin %> <%= command.id %> preview',
        '<%= config.bin %> <%= command.id %> render-example',
    ];

    static args = [
        {
            name: 'command',
            required: true,
            description: 'Command to run',
            options: ['upgrade', 'preview', 'render-example'],
        },
    ];

    public async run(): Promise<void> {
        const { args } = await this.parse(Remotion);

        switch (args.command) {
            case 'upgrade':
                shell.exec('yarn remotion upgrade');
                break;
            case 'preview':
                shell.exec(
                    `yarn remotion preview video/src/index.tsx --props='{\"filename\": \"example.json\", \"destination\": \"youtube\"}'`,
                );
                break;
            case 'renderExample':
                shell.exec(
                    `yarn remotion render video/src/index.tsx Main out.mp4 --props='{\"filename\": \"example.json\", \"destination\": \"youtube\"}'`,
                );
                break;
        }
    }
}
