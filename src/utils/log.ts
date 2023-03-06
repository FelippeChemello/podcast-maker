const debug = process.env.DEBUG || 1;

// eslint-disable-next-line
export function log(message: any, prefix?: string, _?: any): void {
    if (debug) {
        console.log(`${prefix ? `[${prefix}]` : null} ${message}`);
    }
}

// eslint-disable-next-line
export function error(message: any, prefix?: string, _?: any): void {
    console.log(`[ERROR] ${prefix ? `[${prefix}]` : null} ${message}`);
    throw new Error(message);
}
