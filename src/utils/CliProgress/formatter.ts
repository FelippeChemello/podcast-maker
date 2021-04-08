import stringWidth from 'string-width';

export const defaultFormatValue = (v, options, type) => {
    // no autopadding ? passthrough
    if (options.autopadding !== true) {
        return v;
    }

    // padding
    function autopadding(value, length) {
        return (options.autopaddingChar + value).slice(-length);
    }

    switch (type) {
        case 'percentage':
            return autopadding(v, 3);

        default:
            return v;
    }
};

export const defaultFormatTime = (t, options, roundToMultipleOf) => {
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

export const defaultFormatBar = (progress, options) => {
    // calculate barsize
    const completeSize = Math.round(progress * options.barsize);
    const incompleteSize = options.barsize - completeSize;

    // generate bar string by stripping the pre-rendered strings
    return (
        options.barCompleteString.substr(0, completeSize) +
        options.barGlue +
        options.barIncompleteString.substr(0, incompleteSize)
    );
};

// generic formatter
export const defaultFormatter = (options, params, payload) => {
    // copy format string
    let s = options.format;

    // custom time format set ?
    const formatTime = options.formatTime || defaultFormatTime;

    // custom value format set ?
    const formatValue = options.formatValue || defaultFormatValue;

    // custom bar format set ?
    const formatBar = options.formatBar || defaultFormatBar;

    // calculate progress in percent
    const percentage = Math.floor(params.progress * 100) + '';

    // bar stopped and stopTime set ?
    const stopTime = params.stopTime || Date.now();

    // calculate elapsed time
    const elapsedTime = Math.round((stopTime - params.startTime) / 1000);

    // merges data from payload and calculated
    const context = Object.assign({}, payload, {
        bar: formatBar(params.progress, options),

        percentage: formatValue(percentage, options, 'percentage'),
        total: formatValue(params.total, options, 'total'),
        value: formatValue(params.value, options, 'value'),

        eta: formatValue(params.eta, options, 'eta'),
        eta_formatted: formatTime(params.eta, options, 5),

        duration: formatValue(elapsedTime, options, 'duration'),
        duration_formatted: formatTime(elapsedTime, options, 1),
    });

    // assign placeholder tokens
    s = s.replace(/\{(\w+)\}/g, function (match, key) {
        // key exists within payload/context
        if (typeof context[key] !== 'undefined') {
            return context[key];
        }

        // no changes to unknown values
        return match;
    });

    // calculate available whitespace (2 characters margin of error)
    const fullMargin = Math.max(0, params.maxWidth - stringWidth(s) - 2);
    const halfMargin = Math.floor(fullMargin / 2);

    // distribute available whitespace according to position
    switch (options.align) {
        // fill start-of-line with whitespaces
        case 'right':
            s = fullMargin > 0 ? ' '.repeat(fullMargin) + s : s;
            break;

        // distribute whitespaces to left+right
        case 'center':
            s = halfMargin > 0 ? ' '.repeat(halfMargin) + s : s;
            break;

        // default: left align, no additional whitespaces
        case 'left':
        default:
            break;
    }

    return s;
};
