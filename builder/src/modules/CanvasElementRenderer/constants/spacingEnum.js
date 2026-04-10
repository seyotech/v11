export const directionEnum = Object.freeze({
    TOP: 'top',
    BOTTOM: 'bottom',
    LEFT: 'left',
    RIGHT: 'right',
});

export const spacingTypeEnum = Object.freeze({
    PADDING: 'padding',
    MARGIN: 'margin',
});

export const directions = Object.entries(directionEnum).map(([, value]) => {
    return value;
});

export const spacingTypes = Object.entries(spacingTypeEnum).map(([, value]) => {
    return value;
});
