import readline from 'readline';

// low-level terminal interactions
export default class Terminal {
    public isTTY: boolean;

    constructor() {
        this.isTTY = process.stdout.isTTY;
    }

    cursorSave(): void {
        process.stdout.write('\x1B7');
    }

    cursorRestore(): void {
        process.stdout.write('\x1B8');
    }

    resetCursor(): void {
        if (!this.isTTY) {
            return;
        }

        readline.cursorTo(process.stdout, 0);
    }

    clearRight(): void {
        if (!this.isTTY) {
            return;
        }

        readline.clearLine(process.stdout, 1);
    }

    newline(): void {
        process.stdout.write('\n');
    }

    write(s: string): void {
        process.stdout.write(s);
    }

    getWidth(): number {
        return process.stdout.columns || (process.stdout.isTTY ? 80 : 200);
    }
}
