const missingExtensions = {
    ttf: 'font/ttf',
    woff: 'font/woff',
    woff2: 'font/woff2',
};

export const getType = ({ name = '', type } = {}) => {
    const extension = name.split('.').pop();

    return !type || extension in missingExtensions
        ? missingExtensions[extension]
        : type;
};

const generateFileInfo = (files) => {
    return files.map(({ key: path, file }) => ({
        path,
        size: file.size,
        mimeType: getType(file),
        name: file.name.split('.')[0],
    }));
};

export default generateFileInfo;
