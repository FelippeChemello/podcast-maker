import Eta from './eta';
import Terminal from './terminal';
import { defaultFormatBar } from './formatter';
import { EventEmitter } from 'events';

// Progress-Bar constructor
export default class GenericBar extends EventEmitter {
    private options: any;
    private terminal: Terminal;
    private value: number;
    private total: number;
    private lastDrawnString: string;
    private startTime: number;
    private stopTime: Date;
    private lastRedraw: number;
    private eta: Eta;
    private isActive: boolean;
    private formatter: typeof defaultFormatBar;

    constructor(options) {
        super();

        this.terminal = new Terminal(this.options.stream);

        this.value = 0;

        this.total = 100;

        this.lastRedraw = Date.now();

        this.eta = new Eta(this.options.etaBufferLength, 0, 0);

        // progress bar active ?
        this.isActive = false;

        // use default formatter or custom one ?
        this.formatter = defaultFormatBar;
    }

    // internal render function
    render() {
        // calculate the normalized current progress
        let progress = this.value / this.total;

        // handle NaN Errors caused by total=0. Set to complete in this case
        if (isNaN(progress)) {
            progress = this.options && this.options.emptyOnZero ? 0.0 : 1.0;
        }

        // limiter
        progress = Math.min(Math.max(progress, 0.0), 1.0);

        // formatter params
        const params = {
            progress: progress,
            eta: this.eta.getTime(),
            startTime: this.startTime,
            stopTime: this.stopTime,
            total: this.total,
            value: this.value,
            maxWidth: this.terminal.getWidth(),
        };

        // automatic eta update ? (long running processes)
        if (this.options.etaAsynchronousUpdate) {
            this.updateETA();
        }

        // format string
        const s = this.formatter(this.options, params);

        const forceRedraw =
            this.options.forceRedraw ||
            // force redraw in notty-mode!
            (this.options.noTTYOutput && !this.terminal.isTTY());

        // string changed ? only trigger redraw on change!
        if (forceRedraw || this.lastDrawnString != s) {
            // trigger event
            this.emit('redraw-pre');

            // set cursor to start of line
            this.terminal.cursorTo(0);

            // write output
            this.terminal.write(s);

            // clear to the right from cursor
            this.terminal.clearRight();

            // store string
            this.lastDrawnString = s;

            // set last redraw time
            this.lastRedraw = Date.now();

            // trigger event
            this.emit('redraw-post');
        }
    }

    // start the progress bar
    start(total, startValue) {
        // set initial values
        this.value = startValue || 0;
        this.total = typeof total !== 'undefined' && total >= 0 ? total : 100;

        // store start time for duration+eta calculation
        this.startTime = Date.now();

        // reset string line buffer (redraw detection)
        this.lastDrawnString = '';

        // initialize eta buffer
        this.eta = new Eta(
            this.options.etaBufferLength,
            this.startTime,
            this.value,
        );

        // set flag
        this.isActive = true;

        // start event
        this.emit('start', total, startValue);
    }

    // stop the bar
    stop() {
        // set flag
        this.isActive = false;

        // store stop timestamp to get total duration
        this.stopTime = new Date();

        // stop event
        this.emit('stop', this.total, this.value);
    }

    update(value: number) {
        // update value
        this.value = value;

        // add new value; recalculate eta
        this.eta.update(Date.now(), value, this.total);

        // update event (before stop() is called)
        this.emit('update', this.total, this.value);

        // limit reached ? autostop set ?
        if (this.value >= this.getTotal() && this.options.stopOnComplete) {
            this.stop();
        }
    }

    increment(delta: number = 1) {
        this.update(this.value + delta);
    }

    getTotal() {
        return this.total;
    }

    setTotal(total: number) {
        this.total = total;
    }

    updateETA() {
        this.eta.update(Date.now(), this.value, this.total);
    }
}
