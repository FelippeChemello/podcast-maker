import path from 'path';
import fs from 'fs';

import { log } from '../utils/log';
import { tmpPath } from '../config/defaultPaths';

export default class CleanTmpService {
    private except = ['.gitkeep', 'example.json'];

    public execute(): void {
        log(`Cleaning tmp`, 'CleanTmpService');

        const files = fs.readdirSync(tmpPath);

        files.forEach(file => {
            if (this.except.includes(file)) {
                return;
            }

            fs.unlinkSync(path.resolve(tmpPath, file));
        });
    }
}
