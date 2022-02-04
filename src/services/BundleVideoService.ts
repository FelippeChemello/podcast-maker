import path from 'path';
import { bundle } from '@remotion/bundler';

import { log } from '../utils/log';
import { getPath } from '../config/defaultPaths';

export default class BundleVideoService {
    public async execute(): Promise<string> {
        log(`Bundling video`, 'BundleVideoService');
        const bundled = await bundle(
            require.resolve(
                path.resolve(await getPath('remotion'), 'src', 'index.js'),
            ),
        );

        return bundled;
    }
}
