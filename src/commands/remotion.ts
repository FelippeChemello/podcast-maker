import { Command, Flags } from '@oclif/core';
import { GetContentService } from '../services';
import shell from 'shelljs';

export default class Remotion extends Command {
    static description = 'Remotion framework related commands';

    static examples = [
        '<%= config.bin %> <%= command.id %> upgrade',
        '<%= config.bin %> <%= command.id %> preview',
        '<%= config.bin %> <%= command.id %> render-example',
        '<%= config.bin %> <%= command.id %> render-thumb-example',
    ];

    static flags = {
        filename: Flags.string({
            char: 'f',
            description: 'filename with content',
        }),
    }

    static args = [
        {
            name: 'command',
            required: true,
            description: 'Command to run',
            options: ['upgrade', 'preview', 'render-example', 'render-thumb-example'],
        },
    ];

    public async run(): Promise<void> {
        const { args, flags } = await this.parse(Remotion);

        const { content } = await new GetContentService().execute(flags.filename)
        if (!content || !content.renderData) {
            throw new Error('Content not found');
        }
        const durationInFrames = Math.round(this.getFullDuration(content.renderData) * content.fps)


        const props = {
            content,
            destination: 'youtube',
            durationInFrames,
        }
        let command = '';

        switch (args.command) {
            case 'upgrade':
                command = 'yarn remotion upgrade';
                break;
            case 'preview':
                command = `yarn remotion preview video/src/index.tsx --props='${JSON.stringify(props)}'`;
                break;
            case 'render-example':
                command = `yarn remotion render video/src/index.tsx Main out.mp4 --props='${JSON.stringify(props)}'`;
                break;
            case 'render-thumb-example':
                command = `yarn remotion still video/src/index.tsx Thumbnail thumb.png --props='${JSON.stringify(props)}'`;
                break;
        }

        shell.exec(command);
    }

    private getFullDuration(renderData: {
        duration: number;
    }[]): number {
        const transitionDurationInSeconds = 2.9;

        return renderData.reduce(
            (accumulator, currentValue, index) => {
                if (
                    !renderData ||
                    index !== renderData.length - 1
                ) {
                    return (
                        accumulator +
                        currentValue.duration +
                        transitionDurationInSeconds
                    );
                }

                return accumulator + currentValue.duration;
            },
            0,
        );
    }
}
