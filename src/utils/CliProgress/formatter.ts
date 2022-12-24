export const formatTime = (
    t: number,
    options: { autopaddingChar: string },
    roundToMultipleOf: number,
): string => {
    function round(input: number) {
        if (roundToMultipleOf) {
            return roundToMultipleOf * Math.round(input / roundToMultipleOf);
        }

        return input;
    }

    // leading zero padding
    function autopadding(v: number): string {
        return (options.autopaddingChar + v).slice(-2);
    }

    // > 1h ?
    if (t > 3600) {
        return `${autopadding(Math.floor(t / 3600))}h${autopadding(
            round((t % 3600) / 60),
        )}m`;

        // > 60s ?
    }
    if (t > 60) {
        return `${autopadding(Math.floor(t / 60))}m${autopadding(
            round(t % 60),
        )}s`;

        // > 10s ?
    }
    if (t > 10) {
        return `${autopadding(round(t))}s`;

        // default: don't apply round to multiple
    }
    return `${autopadding(t)}s`;
};

export const formatBar = (progress: number): string => {
    const barSize = 50;

    const completeSize = Math.round(progress * barSize);
    const incompleteSize = barSize - completeSize;

    // generate bar string by stripping the pre-rendered strings
    return `${new Array(barSize + 1)
        .join('=')
        .substr(0, completeSize)}>${new Array(barSize + 1)
        .join('-')
        .substr(0, incompleteSize)}`;
};

export const defaultFormatter = (
    text: string,
    params: {
        progress: number;
        eta: number | string;
        rate: number;
        startTime: number;
        total: number;
        value: number;
        maxWidth: number;
    },
    customParams: Record<string, unknown>,
): string => {
    const percentage = `${Math.floor(params.progress * 100)}`;

    const elapsedTime = Math.round((Date.now() - params.startTime) / 1000);

    const formattedData = {
        bar: formatBar(params.progress),
        percentage,
        total: params.total,
        value: params.value,
        eta: params.eta,
        rate: params.rate,
        duration: elapsedTime,
        ...customParams
    };

    const textParsed = text.replace(/\{(\w+)\}/g, (match, key) => {
        if (typeof formattedData[key] !== 'undefined') {
            return formattedData[key];
        }

        return match;
    });

    return textParsed;
};
