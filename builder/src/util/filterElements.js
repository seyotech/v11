const getOmitFields = (isCmsRow) => {
    let cmsElements = ['postContent'];

    if (isCmsRow) {
        cmsElements.length = 0;
    }

    return {
        CMS: {
            cms: {
                TEMPLATE: ['searchWidget'],
                UTIL: [].concat(cmsElements),
                REGULAR: ['searchWidget'].concat(cmsElements),
                HOMEPAGE: ['searchWidget'].concat(cmsElements),
            },
        },
        STATIC: {},
    };
};

export const filterElement = ({
    element,
    appName,
    pageType,
    isCmsRow,
    elementType,
}) => {
    const omitFields = getOmitFields(isCmsRow);
    return !omitFields[appName][elementType]?.[pageType]?.includes(
        element.data.type
    );
};
