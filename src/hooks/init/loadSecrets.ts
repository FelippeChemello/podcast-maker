import { Hook } from '@oclif/core';

import { loadSecrets } from '../../config/secrets';

const hook: Hook<'init'> = async function (opts) {
    await loadSecrets();
};

export default hook;
