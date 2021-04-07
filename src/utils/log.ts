const debug = process.env.DEBUG || 1;

export function log(message: any, prefix?: string) {
    if (debug) {
        console.log(`${prefix ? `[${prefix}]` : null} ${message}`);
    }
}

export function error(message: any, prefix?: string) {
    console.log(`[ERROR] ${prefix ? `[${prefix}]` : null} ${message}`);
    process.exit(1);
}
