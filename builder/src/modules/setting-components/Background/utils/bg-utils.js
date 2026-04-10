export const colorPickerOptions = {
    saved: false,
    clear: true,
    colorVars: true,
    previewWidth: '40px',
};

export const initialVal = {
    direction: '0deg',
    type: 'linear',
    handlers: [
        { position: 0, selected: 0, color: '#FC466B' },
        { position: 100, selected: 0, color: '#3F5EFB' },
    ],
    position: { x: '50%', y: '40%' },
    style: '-webkit-linear-gradient(0deg, rgb(252, 70, 107) 0%, rgb(63, 94, 251) 100%)',
};

export const isRepeatType = (str) => {
    return str.match(/repeating/g)?.length ?? false;
};

export const isRangeVisible = (type) => {
    if (type) {
        return (
            type === 'linear-gradient' ||
            type === 'repeating-linear-gradient' ||
            type === 'conic-gradient' ||
            type === 'repeating-conic-gradient'
        );
    }
    return false;
};

export const getPosition = (WIDTH, currentPosition) => {
    return parseInt(100 / (WIDTH / currentPosition));
};
