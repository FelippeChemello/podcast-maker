const getType = () => {
    const platform = process.platform;

    switch (platform) {
        case 'linux':
            return 'Linux';
        case 'win32':
            return 'Windows';
        case 'darwin':
            return 'MacOS';
        default:
            return 'Other';
    }
};

export const type = getType();
