import Eta from './eta';
import Terminal from './terminal';
import { defaultFormatter } from './formatter';

export default class GenericBar {
    private terminal: Terminal;
    private value: number;
    private total: number;
    private lastDrawnString: string;
    private startTime: number;
    private eta: Eta;
    private formatter: typeof defaultFormatter;
    private text: string =
        'progress [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | Rate: {rate}';
    private timer: NodeJS.Timeout;
    private isActive: boolean;

    constructor({
        total,
        initValue,
        text,
        bufferLength,
    }: {
        total: number;
        initValue: number;
        text?: string;
        bufferLength?: number;
    }) {
        this.terminal = new Terminal();

        this.value = initValue;

        this.startTime = Date.now();

        this.total = total;

        this.eta = new Eta(initValue, total, bufferLength);

        this.lastDrawnString = '';

        this.formatter = defaultFormatter;

        if (text) {
            this.text = text;
        }

        this.isActive = true;

        this.timer = setTimeout(
            () => this.render(),
            this.terminal.isTTY ? 100 : 1000,
        );
    }

    render() {
        if (this.timer) {
            clearTimeout(this.timer);
        }

        if (!this.isActive) {
            const { ratePerSecond } = this.eta.calculate();

            const text = `Process finished in ${
                (Date.now() - this.startTime) / 1000
            }s - Processed ${this.value} of ${
                this.total
            } with a rate of ${ratePerSecond} per second.`;

            this.terminal.resetCursor();

            this.terminal.clearRight();

            this.terminal.write(text);

            this.terminal.newline();

            return;
        }

        const progress = Math.min(
            Math.max(this.value / this.total || 0, 0.0),
            1.0,
        );

        const params = {
            progress: progress,
            eta: this.eta.calculate().eta,
            rate: this.eta.calculate().ratePerSecond,
            startTime: this.startTime,
            total: this.total,
            value: this.value,
            maxWidth: this.terminal.getWidth(),
        };

        const text = this.formatter(this.text, params);

        this.terminal.resetCursor();

        this.terminal.write(text);

        if (this.lastDrawnString != text && !this.terminal.isTTY) {
            this.terminal.newline();
        }

        this.terminal.clearRight();

        this.lastDrawnString = text;

        this.timer = setTimeout(
            () => this.render(),
            this.terminal.isTTY ? 100 : 1000,
        );
    }

    stop() {
        this.isActive = false;
    }

    update(value: number) {
        this.value = value;

        this.eta.update(value);

        if (this.value >= this.total) {
            this.stop();
        }
    }
}
