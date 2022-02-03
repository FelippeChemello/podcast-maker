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
            date: new Date().toLocaleDateString('pt-BR'),
            intro: {
                text: `Olá pessoal, A seguir vocês acompanharão as notícias desta ${new Date().toLocaleDateString(
                    'pt-BR',
                    { weekday: 'long' },
                )}. Na descrição vocês encontram os links para saber mais sobre cada noticia. `,
            },
            end: {
                text:
                    'Estas notícias foram extraídas da newsletter de Filipe Deschamps. Para acompanhar estas notícias em formato de texto, inscreva-se no link na descrição.',
                url: 'https://links.codestack.me/newsletter-filipe',
            },
            news: content?.news
                ? content?.news.map(text => ({ text, url: '' }))
                : newsTemplate,
        };

        const contentFileName = path.resolve(
            await getPath('content'),
            `${timestamp}-${description}.${this.fileType}`,
        );

        fs.writeFileSync(contentFileName, JSON.stringify(template), {
            encoding: 'utf-8',
        });

        log(`Created ${contentFileName}`, 'CreateContentTemplateService');
    }
}
