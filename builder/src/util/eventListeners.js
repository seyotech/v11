/**
 * @param {Object} el DOM Object
 * @param {String} type Event type/name
 * @param {Function} listener Event listener function
 */
export const addEventListener = (el, type, listener) => {
    if (!el) return;
    if (el.addEventListener !== undefined) {
        el.addEventListener(type, listener, false);
    } else {
        el.attachEvent('on' + type, listener);
    }
};

/**
 * @param {Object} el DOM Object
 * @param {String} type Event type/name
 * @param {Function} listener Event listener function
 */
export const removeEventListener = (el, type, listener) => {
    if (!el) return;
    if (el.removeEventListener !== undefined) {
        el.removeEventListener(type, listener, false);
    } else {
        el.detachEvent('on' + type, listener);
    }
};
