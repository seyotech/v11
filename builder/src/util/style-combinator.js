function camelCase(string) {
    return string
        .split('-')
        .map((item) => item.toLowerCase())
        .map((item, index) => {
            return index === 0
                ? item
                : item.charAt(0).toUpperCase() + item.substring(1);
        })
        .join('');
}

export default function styleCombinator(parentProp, data = []) {
    const result = {};
    data.forEach(([childProp, value]) => {
        const cssProperty = camelCase(parentProp + '-' + childProp);
        result[cssProperty] = value;
    });
    return result;
}
