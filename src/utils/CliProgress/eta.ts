export default class ETA {
    private etaBufferLength: number;
    private total: number;
    private timeBuffer: number[];
    private valueBuffer: number[];
    private currentValue: number;

    constructor(initValue: number, total: number, bufferLength?: number) {
        this.etaBufferLength = bufferLength || 1000;

        this.currentValue = initValue;
        this.valueBuffer = [initValue];
        this.timeBuffer = [Date.now()];
        this.total = total;
    }

    setTotal(total: number): void {
        this.total = total;
    }

    update(value: number): void {
        this.valueBuffer.push(value);
        this.timeBuffer.push(Date.now());

        this.currentValue = value;
    }

    calculate(): { eta: string | number; ratePerSecond: number } {
        const valueDiffFromInitialValueToCurrent =
            this.valueBuffer[this.valueBuffer.length - 1] - this.valueBuffer[0];
        const timeDiffFromInitialValueToCurrent =
            this.timeBuffer[this.valueBuffer.length - 1] - this.timeBuffer[0];

        const ratePerSecond =
            valueDiffFromInitialValueToCurrent /
            (timeDiffFromInitialValueToCurrent / 1000);

        // Keep only last values
        this.valueBuffer = this.valueBuffer.slice(-this.etaBufferLength);
        this.timeBuffer = this.timeBuffer.slice(-this.etaBufferLength);

        const eta = Math.ceil((this.total - this.currentValue) / ratePerSecond);

        // eslint-disable-next-line no-restricted-globals
        if (isNaN(eta)) {
            return { eta: 'NULL', ratePerSecond };
        }

        // eslint-disable-next-line no-restricted-globals
        if (!isFinite(eta) || eta > 1e7) {
            // 1e7 = ~115days (1e7/60/60/24)
            return { eta: 'INF', ratePerSecond };
        }

        if (eta < 0) {
            return { eta: 0, ratePerSecond };
        }

        return { eta, ratePerSecond: Math.round(ratePerSecond * 100) / 100 };
    }
}
