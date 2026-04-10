import ucFirst from './ucFirst';

export function capitalize(string) {
    if (typeof string !== 'string') throw Error('Input is not a string');
    return string.split(' ').map(ucFirst).join(' ');
}
