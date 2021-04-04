import fs from 'fs';
import path from 'path';

import { log } from '../utils/log';
import { contentPath } from '../config/defaultPaths';
import InterfaceJsonContent from '../models/InterfaceJsonContent';

export default class CreateContentTemplateService {
    private fileType = 'json';

    constructor() {}

    public execute(
        description: string,
        options: { fps?: number; height?: number; width?: number },
    ): void {
        const { fps, height, width } = options;

        const timestamp = Math.round(Date.now() / 1000);

        const template: InterfaceJsonContent = {
            title: '',
            fps: fps ?? 30,
            height: height ?? 1080,
            width: width ?? 1920,
            timestamp,
            news: [
                {
                    text: `Olá pessoal, A seguir vocês acompanharão as notícias desta ${new Date().toLocaleDateString(
                        'pt-BR',
                        { weekday: 'long' },
                    )}. Na descrição vocês encontram os links para saber mais sobre cada noticia. `,
                },
                {
                    text: '',
                    url: '',
                },
                {
                    text: '',
                    url: '',
                },
            ],
        };

        const contentFileName = path.resolve(
            contentPath,
            `${timestamp}-${description}.${this.fileType}`,
        );

        fs.writeFileSync(contentFileName, JSON.stringify(template), {
            encoding: 'utf-8',
        });

        log(`Created ${contentFileName}`, 'CreateContentTemplateService');
    }
}
