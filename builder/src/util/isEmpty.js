/**
 * Checks if the object/array is empty
 * @param {Object|Array} obj
 */
export default function isEmpty(obj) {
    return typeof obj === 'object' ? !Object.keys(obj).length : true;
}
