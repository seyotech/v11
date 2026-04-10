import isObject from './isObject';

/**
 *
 * @param {string} path A string of path representation to the resource where nested props are separated by `/`
 * @param {*} resource An Object
 */
const getPathValue = (path, resource) => {
    if (path === undefined) return '';
    return path
        .split('/')
        .filter((v) => v)
        .reduce(
            (acc, next) => (isObject(acc) ? acc[next] : undefined),
            resource
        );
};

export default getPathValue;
