import getPathValue from 'util/getPathValue';

export const getActiveStateData = ({ activeState, path, data, value }) => {
    const newPath = `${activeState}/${path}`;
    const activeStateValue = getPathValue(newPath, data) ?? value;
    const activeStatePlaceholder =
        value === activeStateValue || !activeStateValue ? value : '';
    let newValue = activeStateValue;
    // TODO: refactor the way it takes responsive value
    if (path === 'attr/__class__columnSize') {
        newValue = activeStateValue || '1/1';
    }

    return [newPath, newValue, activeStatePlaceholder];
};

export const getResponsiveValue = ({ responsivePath, path, data, value }) => {
    value = value ?? getPathValue(path, data);
    let newValue = getPathValue(path, data);
    const newPath = `${responsivePath}/${path}`;
    if (path === 'attr/__class__columnSize') {
        return getActiveStateData({
            activeState: responsivePath,
            path,
            data,
            value,
        });
    }
    const sources = [`media/mobile/${path}`, `media/tablet/${path}`, path];
    const fromIndex = sources.indexOf(newPath);
    const fromSources = sources.slice(fromIndex);
    for (let i = 0; i < fromSources.length; i++) {
        const source = fromSources[i];
        const sourceValue = getPathValue(source, data);
        if (sourceValue) {
            newValue = sourceValue;
            break;
        }
    }

    return [newPath, newValue];
};
