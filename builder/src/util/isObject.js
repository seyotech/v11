/**
 * Check whether the value is an actual Object or not.
 * @param {*} value
 * @returns {Boolean}
 */
export default function isObject(value) {
    if (!value) {
        return false;
    }

    return value.constructor.name === 'Object';
}
