import { prefix } from '../config';
import getHideClass from './getHideClass';
import isObject from './isObject';

export const getElementClass = (item) => {
    let className = `${prefix}-${item.type}-${item.id}`;
    if (item.symbolId) {
        className = `symbol--${item.symbolId} ${className}`;
    }
    className += ' ' + getHideClass(item?.settings?.hideOn);
    if (isObject(item.attr)) {
        Object.entries(item.attr).forEach(([key, value]) => {
            if (key.includes('__class__') || key === 'class') {
                className += ' ' + value;
            }
        });
    }
    return className.trim();
};
