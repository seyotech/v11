export default function unitValue(string) {
    if (typeof string === 'number') return [string];
    if (typeof string !== 'string') return [0];
    let input,
        value = 0,
        unit = '';
    const matched = string.match(/^([+-]?\d*[.]?\d*?)(\D*)$/);
    if (matched) {
        [input, value, unit] = matched;
    }
    return [value ? Number(Number(value).toFixed(2)) : 0, unit];
}
