import path from 'path';
import fs from 'fs';

import { log } from '../utils/log';
import { getPath } from '../config/defaultPaths';

export default class CleanTmpService {
    private except = ['.gitkeep', 'example.json'];

    public async execute() {
        log(`Cleaning tmp`, 'CleanTmpService');

        const tmpPath = await getPath('tmp');

        const files = fs.readdirSync(tmpPath);

        files.forEach(file => {
            if (this.except.includes(file)) {
                return;
            }

            if (fs.statSync(path.resolve(tmpPath, file)).isDirectory()) {
                return fs.rmdirSync(path.resolve(tmpPath, file), {
                    recursive: true,
                });
            }

            fs.unlinkSync(path.resolve(tmpPath, file));
        });
    }
}
