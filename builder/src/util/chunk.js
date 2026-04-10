/**
 *
 * @param {array} arr
 * @param {number} size
 */
const chunk = (arr, size) => {
    if (!Array.isArray(arr)) {
        console.error(`First argument must be an array`);
        return;
    }
    if (!size) return [...arr];
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size)
    );
};

export default chunk;
