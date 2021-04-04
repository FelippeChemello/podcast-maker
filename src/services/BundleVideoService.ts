import path from 'path';

import { log } from '../utils/log';
import { remotionPath } from '../config/defaultPaths';
import { bundle } from '@remotion/bundler';

export default class BundleVideoService {
    constructor() {}

    public async execute(): Promise<string> {
        log(`Bundling video`, 'BundleVideoService');
        return await bundle(
            require.resolve(path.resolve(remotionPath, 'src', 'index.tsx')),
        );
    }
}
