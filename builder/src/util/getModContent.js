import moduleResources from '../components/editor-resources';
import getPathValue from './getPathValue';
import isObject from './isObject';

const getModContent = (module) => {
    if (typeof module === 'string') {
        return getPathValue(module, moduleResources);
    }
    if (isObject(module)) {
        const { path, content, showLabelExtra } = module;
        if (path) {
            const defaultContent = getPathValue(path, moduleResources);
            return { ...defaultContent, ...content, showLabelExtra };
        }
        return content;
    }
};

export default getModContent;
