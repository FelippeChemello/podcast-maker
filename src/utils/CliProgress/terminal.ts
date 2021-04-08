import readline from 'readline';

// low-level terminal interactions
export default class Terminal {
    private stream: any;
    private linewrap: boolean;
    private dy: number;

    constructor(outputStream) {
        this.stream = outputStream;

        // default: line wrapping enabled
        this.linewrap = true;

        // current, relative y position
        this.dy = 0;
    }

    // save cursor position + settings
    cursorSave() {
        if (!this.stream.isTTY) {
            return;
        }

        // save position
        this.stream.write('\x1B7');
    }

    // restore last cursor position + settings
    cursorRestore() {
        if (!this.stream.isTTY) {
            return;
        }

        // restore cursor
        this.stream.write('\x1B8');
    }

    // show/hide cursor
    cursor(enabled) {
        if (!this.stream.isTTY) {
            return;
        }

        if (enabled) {
            this.stream.write('\x1B[?25h');
        } else {
            this.stream.write('\x1B[?25l');
        }
    }

    // change cursor positionn
    cursorTo(x?: number, y?: number) {
        if (!this.stream.isTTY) {
            return;
        }

        // move cursor absolute
        readline.cursorTo(this.stream, x || 0, y || 0);
    }

    // change relative cursor position
    cursorRelative(dx?: number, dy?: number) {
        if (!this.stream.isTTY) {
            return;
        }

        // store current position
        this.dy = this.dy + (dy || 0);

        // move cursor relative
        readline.moveCursor(this.stream, dx || 0, dy || 0);
    }

    // relative reset
    cursorRelativeReset() {
        if (!this.stream.isTTY) {
            return;
        }

        // move cursor to initial line
        readline.moveCursor(this.stream, 0, -this.dy);

        // first char
        readline.cursorTo(this.stream, 0);

        // reset counter
        this.dy = 0;
    }

    // clear to the right from cursor
    clearRight() {
        if (!this.stream.isTTY) {
            return;
        }

        readline.clearLine(this.stream, 1);
    }

    // clear the full line
    clearLine() {
        if (!this.stream.isTTY) {
            return;
        }

        readline.clearLine(this.stream, 0);
    }

    // clear everyting beyond the current line
    clearBottom() {
        if (!this.stream.isTTY) {
            return;
        }

        readline.clearScreenDown(this.stream);
    }

    // add new line; increment counter
    newline() {
        this.stream.write('\n');
        this.dy++;
    }

    // write content to output stream
    // @TODO use string-width to strip length
    write(s) {
        // line wrapping enabled ? trim output
        if (this.linewrap === true) {
            this.stream.write(s.substr(0, this.getWidth()));
        } else {
            this.stream.write(s);
        }
    }

    // control line wrapping
    lineWrapping(enabled) {
        if (!this.stream.isTTY) {
            return;
        }

        // store state
        this.linewrap = enabled;
        if (enabled) {
            this.stream.write('\x1B[?7h');
        } else {
            this.stream.write('\x1B[?7l');
        }
    }

    // tty environment ?
    isTTY() {
        return this.stream.isTTY === true;
    }

    // get terminal width
    getWidth() {
        // set max width to 80 in tty-mode and 200 in notty-mode
        return this.stream.columns || (this.stream.isTTY ? 80 : 200);
    }
}
