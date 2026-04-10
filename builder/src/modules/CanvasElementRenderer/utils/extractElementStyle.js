import { styleGenerator } from '@dorik/style-generator';

/**
 * Extracts and generates styles for an element, considering symbol data and parent types.
 *
 * @param {object} options - The options object containing element, global, symbols, and parentType.
 * @param {object} options.element - The element to extract styles from.
 * @param {object} options.global - The global settings object.
 * @param {object} options.symbols - The symbols object containing symbol data.
 * @param {string} options.parentType - The type of the parent element.
 * @returns {JSX.Element | null} The generated style JSX.Element or null if no styles are generated.
 */
export const extractElementStyle = ({
    element,
    global,
    symbols,
    parentType,
}) => {
    const { settings = {} } = global || {};
    const { columnGap = '30px', colors } = settings;
    const { symbolId } = element;

    // Replace element with symbol data if a symbolId is present
    const item = symbolId
        ? { ...symbols[symbolId]?.data, symbolId }
        : { ...element };

    // Apply gap to container style if the parent is a section and the item is a container
    if (parentType === 'section' && item.type === 'container') {
        item.style = { ...item.style, gap: item.style.gap || columnGap };
        item.holder = 'root';
    }

    // Replace element in content array with symbol data if symbolId is present
    if (Array.isArray(item.content)) {
        item.content = item.content.filter(Boolean).map((nestedItem) =>
            nestedItem.symbolId
                ? {
                      ...symbols[nestedItem.symbolId]?.data,
                      symbolId: nestedItem.symbolId,
                  }
                : { ...nestedItem }
        );
    }

    // Use styleGenerator function to generate styles
    const styles = styleGenerator(item, colors);

    // Use a conditional rendering to output the styles if they exist
    return styles ? <style type="text/css">{styles}</style> : null;
};
