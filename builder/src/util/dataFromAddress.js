import deepCopy from './deepCopy';

/**
 * @param {Object} data The data store
 * @param {String} address Array chain string as address
 */
export default function dataFromAddress(data, address, deep = false) {
    const addr = address ? address.split('.') : [];
    const result = deep ? deepCopy(data) : { ...data };
    const item = addr.reduce((acc, index) => acc.content[index], result);
    return [result, item];
}
