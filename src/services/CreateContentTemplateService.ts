import fs from 'fs';
import path from 'path';

import { log } from '../utils/log';
import { getPath } from '../config/defaultPaths';
import InterfaceJsonContent from '../models/InterfaceJsonContent';

export default class CreateContentTemplateService {
    private fileType = 'json';

    public async execute(
        description: string,
        content?: { news: string[]; title: string },
    ) {
        const timestamp = Math.round(Date.now() / 1000);

        const newsTemplate = new Array(10).fill({
            text: '',
            url: '',
        });

        const template: InterfaceJsonContent = {
            title: content?.title ?? '',
            fps: 30,
            timestamp,
            width: 0,
            height: 0,
            date: new Date().toLocaleDateString('pt-BR'),
            intro: {
                text: `Olá pessoal, sigam agora com as notícias desta ${new Date().toLocaleDateString(
                    'pt-BR',
                    { weekday: 'long' },
                )}.`,
            },
            end: {
                text:
                    'Notícias extraídas da newsletter de Filipe Deschamps. Inscreva-se no link na descrição.',
                url: 'https://bit.ly/newsletter-filipe-deschamps',
            },
            news: content?.news
                ? content?.news.map(text => ({ text, url: '' }))
                : newsTemplate,
        };

        const contentFileName = path.resolve(
            await getPath('content'),
            `${timestamp}-${description}.${this.fileType}`,
        );

        fs.writeFileSync(contentFileName, JSON.stringify(template, null, 4), {
            encoding: 'utf-8',
        });

        log(`Created ${contentFileName}`, 'CreateContentTemplateService');
    }
}
