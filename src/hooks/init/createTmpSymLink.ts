import fs from 'fs';
import path from 'path';
import { Hook } from '@oclif/core';
import { ln } from 'shelljs';

import { getPath } from '../../config/defaultPaths';

const hook: Hook<'init'> = async function (opts) {
    const tmpSymlinkPath = path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        'video',
        'tmp',
    );

    if (!fs.existsSync(tmpSymlinkPath)) {
        ln('-sf', await getPath('tmp'), tmpSymlinkPath);
    }
};

export default hook;
