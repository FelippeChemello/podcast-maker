import { error } from '../utils/log';
import InterfaceJsonContent from '../models/InterfaceJsonContent';

export default class InstagramUploadService {
    private content: InterfaceJsonContent;
    private defaultHashtags = [
        'CodeStackNews',
        'noticias',
        'technews',
        'noticiasrapidas',
        'tecnologia',
        'ia',
        'programacao',
        'newsletter',
        'newsletterfilipedeschamps',
    ];

    constructor(content: InterfaceJsonContent) {
        this.content = content;
    }

    public async execute(
        videoPath: string,
        thumnailPath: string,
    ): Promise<void> {
        try {
            const description = this.getDescription();

            console.log(description);
        } catch (err) {
            console.log(err);

            error(
                'Failed at uploading video \n' + JSON.stringify(err),
                'YoutubeUploadService',
            );
        }
    }

    private getDescription() {
        let description = `[CodeStack News] ${this.content.title} \n\n`;

        this.content.news.forEach(news => {
            const [title, _] = news.text.split(': ');
            description += `• ${title} \n`;
        });

        if (
            this.content.end?.text &&
            (this.content.end.shortLink || this.content.end.url)
        ) {
            description += `\n\n${this.content.end.text} \n${
                this.content.end.shortLink || this.content.end.url
            } \n\n`;
        }

        this.defaultHashtags.forEach(hashtag => {
            description += `#${hashtag} `;
        });

        return description;
    }
}
