import fs from 'fs';
import path from 'path';
import { Hook } from '@oclif/core';
import { ln } from 'shelljs';

import { getPath } from '../../config/defaultPaths';

const commandsToRun = ['clean', 'configure', 'content', 'create', 'remotion'];

const hook: Hook<'init'> = async function (opts) {
    if (!commandsToRun.includes(opts.id || '')) return;

    const tmpSymlinkPath = path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        'public'
    );

    if (!fs.existsSync(tmpSymlinkPath)) {
        ln('-sf', await getPath('tmp'), tmpSymlinkPath);
    }
};

export default hook;
