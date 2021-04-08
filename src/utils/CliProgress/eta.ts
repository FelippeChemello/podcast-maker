export default class ETA {
    private etaBufferLength: number;
    private eta: number | string;
    private timeBuffer: number[];
    private valueBuffer: number[];

    constructor(length: number, initTime: number, initValue: number) {
        this.etaBufferLength = length || 1000;

        this.valueBuffer = [initValue];
        this.timeBuffer = [initTime];

        this.eta = 0;
    }

    update(time: number, value: number, total: number) {
        this.valueBuffer.push(value);
        this.timeBuffer.push(time);

        this.calculate(total - value);
    }

    getTime() {
        return this.eta;
    }

    calculate(remaining: number) {
        const currentBufferSize = this.valueBuffer.length;
        const bufferSize = Math.min(this.etaBufferLength, currentBufferSize);

        const valueDiffFromInitialValueToCurrent =
            this.valueBuffer[currentBufferSize - 1] -
            this.valueBuffer[currentBufferSize - bufferSize];
        const timeDiffFromInitialValueToCurrent =
            this.timeBuffer[currentBufferSize - 1] -
            this.timeBuffer[currentBufferSize - bufferSize];

        const valueTimeRateInMilliSeconds =
            valueDiffFromInitialValueToCurrent /
            timeDiffFromInitialValueToCurrent;

        // Keep only last values
        this.valueBuffer = this.valueBuffer.slice(-this.etaBufferLength);
        this.timeBuffer = this.timeBuffer.slice(-this.etaBufferLength);

        const eta = Math.ceil(remaining / valueTimeRateInMilliSeconds / 1000);

        if (isNaN(eta)) {
            this.eta = 'NULL';
        } else if (!isFinite(eta) || eta > 1e7) {
            // 1e7 = ~115days (1e7/60/60/24)
            this.eta = 'INF';
        } else if (eta < 0) {
            this.eta = 0;
        } else {
            this.eta = eta;
        }
    }
}
