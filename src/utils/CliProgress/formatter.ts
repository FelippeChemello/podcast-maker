import stringWidth from 'string-width';

export const formatTime = (t, options, roundToMultipleOf) => {
    function round(input) {
        if (roundToMultipleOf) {
            return roundToMultipleOf * Math.round(input / roundToMultipleOf);
        } else {
            return input;
        }
    }

    // leading zero padding
    function autopadding(v) {
        return (options.autopaddingChar + v).slice(-2);
    }

    // > 1h ?
    if (t > 3600) {
        return (
            autopadding(Math.floor(t / 3600)) +
            'h' +
            autopadding(round((t % 3600) / 60)) +
            'm'
        );

        // > 60s ?
    } else if (t > 60) {
        return (
            autopadding(Math.floor(t / 60)) +
            'm' +
            autopadding(round(t % 60)) +
            's'
        );

        // > 10s ?
    } else if (t > 10) {
        return autopadding(round(t)) + 's';

        // default: don't apply round to multiple
    } else {
        return autopadding(t) + 's';
    }
};

export const formatBar = (progress: number) => {
    const barSize = 50;

    const completeSize = Math.round(progress * barSize);
    const incompleteSize = barSize - completeSize;

    // generate bar string by stripping the pre-rendered strings
    return (
        new Array(barSize + 1).join('=').substr(0, completeSize) +
        '>' +
        new Array(barSize + 1).join('-').substr(0, incompleteSize)
    );
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
) => {
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
    };

    const textParsed = text.replace(/\{(\w+)\}/g, function (match, key) {
        if (typeof formattedData[key] !== 'undefined') {
            return formattedData[key];
        }

        return match;
    });

    return textParsed;
};
