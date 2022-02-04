import { Command } from '@oclif/core';

import { CleanTmpService } from '../services';

export default class Clean extends Command {
    static description = 'Cleans TMP directory';

    static examples = ['<%= config.bin %> <%= command.id %>'];

    public async run(): Promise<void> {
        await new CleanTmpService().execute();
    }
}
