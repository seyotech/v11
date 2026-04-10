const containerCSSKeys = new Set([
    'alignSelf',
    'justifySelf',
    'order',
    'flexGrow',
    'width',
]);

/**
 * Filters and generates flex styles based on a provided style object.
 *
 * @param {object} options.style - The style object to filter.
 * @returns {object} - The filtered flex styles object.
 * @throws {TypeError} - If style is not an object.
 *
 * @example
 *
 * const containerStyle = {
 *     flexGrow: 1,
 *     borderRadius: '5px',
 *     order: 2,
 * }
 *
 * const flexStyles = filterAndGenerateFlexStyles({ style: containerStyle });
 * console.log(flexStyles);
 * Output: { flexGrow: 1, order: 2, display: 'flex' }
 */
export const filterAndGenerateFlexStyles = ({ style, type, parentType }) => {
    if (![type, parentType].includes('container') || !style) return {};

    // Check if style is an object
    if (typeof style !== 'object' || Array.isArray(style)) {
        throw new TypeError('style must be an object');
    }

    // Filter style entries based on containerCSSKeys
    const filteredEntries = Object.entries(style).filter(([key]) =>
        containerCSSKeys.has(key)
    );

    // If there are filtered entries, add 'display: flex' and return as object
    return filteredEntries.length
        ? Object.fromEntries([...filteredEntries, ['display', 'flex']])
        : {};
};
