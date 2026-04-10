const getConditions = ({ overlayPath }) => {
    const colorOverLay = [overlayPath, '===', 'color-overlay'];
    return {
        colorOverLay,
    };
};

const getOverlayContent = ({ prefix }) => {
    const overlayContent = {
        colorOverlay: {
            path: `${prefix}/backgroundColor`,
            content: {
                template: 'ColorPicker',
                placeholder: 'eg: #ff00ff',
            },
        },
    };

    return overlayContent;
};

export const overlaySettings = ({
    prefix = 'pseudoClass/before/style',
    overlayPath = 'attr/__class__overlayType',
} = {}) => {
    const overlayContent = getOverlayContent({ prefix });
    const conditions = getConditions({ prefix, overlayPath });

    return [
        overlayPath,
        {
            ...overlayContent.colorOverlay,
            conditions: conditions.colorOverLay,
        },
    ];
};
