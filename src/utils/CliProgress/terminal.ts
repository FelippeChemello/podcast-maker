import readline from 'readline';

// low-level terminal interactions
export default class Terminal {
    public isTTY: boolean;

    constructor() {
        this.isTTY = process.stdout.isTTY;
    }

    cursorSave() {
        process.stdout.write('\x1B7');
    }

    cursorRestore() {
        process.stdout.write('\x1B8');
    }

    resetCursor() {
        if (!this.isTTY) {
            return;
        }

        readline.cursorTo(process.stdout, 0);
    }

    clearRight() {
        if (!this.isTTY) {
            return;
        }

        readline.clearLine(process.stdout, 1);
    }

    newline() {
        process.stdout.write('\n');
    }

    write(s: string) {
        process.stdout.write(s);
    }

    getWidth() {
        return process.stdout.columns || (process.stdout.isTTY ? 80 : 200);
    }
}
