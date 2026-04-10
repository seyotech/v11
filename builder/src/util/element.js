import { handleCMSAddress } from './getAddressValue/getAddressValue';
import uniqId from './uniqId';

/**
 *
 * @param {string} addr A dot(.) joined string representation of element located in JSON
 * @returns {string[]} Returns an array of element location indexes
 */
export const splitAddress = (addr) => addr?.split('.') || [];

/**
 *
 * @param {string[]} addressArray An array representation of element located in JSON
 * @returns {string} Returns a dot(.) joined string representation of element located in JSON
 */
export const joinAddress = (addressArray) => addressArray.join('.');

/**
 *
 * @param {object} data This is a source object where update will happen
 * @param {string[]} address Address of element to be updated
 * @param {Updater} updaterCb This callback function updates the content array
 * @returns {object} The return value is updated version of source object
 */
export const updateEdgeContent = (data, address, updaterCb) => {
    data = data || {};
    const content = data.content?.slice() || [];
    if (address.length > 1) {
        const [index, ...rest] = address;
        content[index] = updateEdgeContent(content[index], rest, updaterCb);
    } else {
        const [index] = address;
        const edgeContent = updaterCb(content, index);
        return { ...data, content: edgeContent };
    }
    return { ...data, content };
};

/**
 * @callback Updater
 * @param {object[]} edgeContent This is an array of final elements
 * @param {string} index This is the index of final edit element
 */

export const replaceIds = (obj) => {
    obj = { ...obj };
    obj.id = uniqId();
    if (Array.isArray(obj.content)) {
        obj.content = obj.content.map((item) => replaceIds(item));
    }
    return obj;
};

export const resetActiveFocus = () => {
    document.activeElement.blur();
};

export const getElement = (data, address) =>
    address.reduce((acc, index) => acc.content[index], data);

export const getElementAddress = ({ isCMS, address, data, symbols }) => {
    if (!isCMS) return splitAddress(address);

    const cmsSourceRow = handleCMSAddress({
        data,
        symbols,
        address,
    });

    return splitAddress(cmsSourceRow || address);
};

export const getElementContext = ({ address, data, symbols }) => {
    const elmContext = address.reduce(
        (prev, key, index, addr) => {
            const element = prev.element?.content[key];
            const isLast = addr.length - 1 === index;

            if (element?.symbolId) {
                const symbolAddress = addr.slice(0, index + 1);
                const symbol = symbols[element.symbolId].data;

                return {
                    address,
                    element: symbol,
                    symbolAddress,
                    symbolId: element.symbolId,
                    parentSymbolId: isLast
                        ? prev.parentSymbolId
                        : element.symbolId,
                    parentSymbolAddress: isLast
                        ? prev.parentSymbolAddress
                        : symbolAddress,
                };
            } else {
                return {
                    address,
                    element,
                    parentSymbolId: prev.parentSymbolId,
                    parentSymbolAddress: prev.parentSymbolAddress,
                };
            }
        },
        { element: data }
    );

    return {
        ...elmContext,
        addressInParent:
            elmContext.parentSymbolAddress &&
            address.slice(elmContext.parentSymbolAddress.length),
    };
};

export const saveOne = (edgeItem, payload) => {
    const { path, value } = payload;
    path?.split('/').reduce((acc, key, index, arr) => {
        if (arr.length === index + 1) {
            return (acc[key] = value);
        } else {
            if (!acc[key]) {
                acc[key] = {};
            }
            return (acc[key] = { ...acc[key] });
        }
    }, edgeItem);
};
