import getPathValue from './getPathValue';

/**
 * Resolves path to values
 * @param {array} arr an Array of conditions JSON format
 * @param {object} resource
 * @returns {array} array of pure conditions
 */
const resolveValues = (conditions, resource) =>
    conditions.map((cnd) =>
        Array.isArray(cnd)
            ? resolveValues(cnd, resource)
            : /\//.test(cnd)
            ? getPathValue(cnd, resource)
            : cnd
    );

export default resolveValues;
