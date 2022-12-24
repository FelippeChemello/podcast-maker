import Eta from './eta';
import Terminal from './terminal';
import { defaultFormatter } from './formatter';

export default class GenericBar {
    private terminal: Terminal;
    private value: number;
    private total: number | undefined;
    private lastDrawnString: string;
    private startTime: number;
    private eta: Eta;
    private formatter: typeof defaultFormatter;
    private text =
        'progress [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | Rate: {rate}';
    private timer: NodeJS.Timeout;
    private isActive: boolean;
    private customParams: Record<string, unknown>;
    private autoStop: boolean;

    constructor({
        total,
        initValue,
        text,
        bufferLength,
        autoStop = true,
    }: {
        total?: number;
        initValue: number;
        text?: string;
        bufferLength?: number;
        autoStop?: boolean;
    }) {
        this.terminal = new Terminal();

        this.value = initValue;

        this.startTime = Date.now();

        this.total = total;

        this.eta = new Eta(initValue, total || Infinity, bufferLength);

        this.lastDrawnString = '';

        this.formatter = defaultFormatter;

        if (text) {
            this.text = text;
        }

        this.isActive = true;

        this.customParams = {};

        this.autoStop = autoStop;

        this.timer = setTimeout(
            () => this.render(),
            this.terminal.isTTY ? 100 : 1000,
        );
    }

    render(): void {
        if (this.timer) {
            clearTimeout(this.timer);
        }

        if (!this.isActive) {
            const { ratePerSecond } = this.eta.calculate();

            const text = `Process finished in ${(Date.now() - this.startTime) / 1000
                }s - Processed ${this.value} of ${this.total
                } with a rate of ${ratePerSecond} per second.`;

            this.terminal.resetCursor();

            this.terminal.clearRight();

            this.terminal.write(text);

            this.terminal.newline();

            return;
        }

        const progress = Math.min(
            Math.max(this.value / (this.total || Infinity), 0.0),
            1.0,
        );

        const params = {
            progress,
            eta: this.eta.calculate().eta,
            rate: this.eta.calculate().ratePerSecond,
            startTime: this.startTime,
            total: this.total || Infinity,
            value: this.value,
            maxWidth: this.terminal.getWidth(),
        };

        const text = this.formatter(this.text, params, this.customParams);

        this.terminal.resetCursor();

        this.terminal.write(text);

        if (this.lastDrawnString !== text && !this.terminal.isTTY) {
            this.terminal.newline();
        }

        this.terminal.clearRight();

        this.lastDrawnString = text;

        this.timer = setTimeout(
            () => this.render(),
            this.terminal.isTTY ? 100 : 1000,
        );
    }

    stop(): void {
        this.isActive = false;
    }

    update(value: number, custom?: Record<string, unknown>): void {
        this.value = value;
        this.customParams = custom || {};

        this.eta.update(value);

        if (this.autoStop && this.total && this.value >= this.total) {
            this.stop();
        }
    }

    setTotal(total: number): void {
        this.total = total;

        this.eta.setTotal(total);
    }
}
