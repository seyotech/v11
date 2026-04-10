const getTypeOf = (value, type) =>
    Object.prototype.toString
        .call(value)
        .match(/[A-Z]\w+/)
        .shift() === type;

export const isArray = (value) => getTypeOf(value, 'Array');

export const isObject = (value) => getTypeOf(value, 'Object');

export const isFunction = (value) => getTypeOf(value, 'Function');
