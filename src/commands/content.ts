import { Command } from '@oclif/core';

import {
    CreateContentTemplateService,
    MailToJsonService,
    ValidatesContentService,
} from '../services';

export default class Content extends Command {
    static description = 'Generate or validate content file';

    static examples = [
        '<%= config.bin %> <%= command.id %> mail',
        '<%= config.bin %> <%= command.id %> template [DESCRIPTION]',
        '<%= config.bin %> <%= command.id %> validate',
    ];

    static args = [
        {
            name: 'command',
            required: true,
            description: 'Command to run',
            options: ['mail', 'template', 'validate'],
        },
        {
            name: 'description',
            required: false,
            description: 'Description of the template',
        },
    ];

    public async run(): Promise<void> {
        const { args } = await this.parse(Content);

        switch (args.command) {
            case 'mail':
                await new MailToJsonService().execute();
                break;
            case 'template':
                const { description } = args;
                if (!description) throw new Error('Missing description');

                await new CreateContentTemplateService().execute(description);
                break;
            case 'validate':
                await new ValidatesContentService().execute();
                break;
        }

        this.config
    }
}
