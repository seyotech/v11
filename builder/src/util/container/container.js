import CreateSection from 'util/CreateSection';
import uniqId from '../uniqId';

const defaultStyles = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: [
        ['top', '10px'],
        ['bottom', '10px'],
    ],
};

/**
 * Creates a container element with the specified configuration.
 *
 * @param {object} options - The configuration options for the container.
 * @param {string} [options.name='Container'] - The name of the container.
 * @param {object} [options.style] - The styles for the container.
 * @param {string} [options.holder='container'] - The holder type for the container.
 * @returns {object} The created container object.
 *
 * @example
 * const container = new CreateContainer({
 *     name: 'MyContainer',
 *     style: {
 *         flexBasis: '50%',
 *     },
 * });
 */
export class CreateContainer {
    constructor({ name = 'Container', style, holder = 'container', media }) {
        return {
            name,
            media,
            holder,
            type: 'container',
            content: [],
            id: uniqId(),
            _elType: 'CONTAINER',
            component_path: 'container',
            style: {
                ...defaultStyles,
                ...style,
            },
        };
    }
}

/**
 * Creates an array of containers with specified sizes.
 *
 * @param {object} options - The options for creating containers.
 * @param {number[]} options.sizes - An array of sizes in percentage for the containers.
 * @param {boolean} options.isRoot - Define root container or wrapper container
 * @returns {object[]} An array of created container objects.
 *
 * @example
 * const containers = createContainers({ sizes: [25, 50, 25] });
 */
export const createContainers = ({ sizes, isRoot }) => {
    const holder = isRoot ? 'root' : 'container';
    const parentContainer = new CreateContainer({
        holder,
        style: {
            flexBasis: '100%',
            justifyContent: isRoot ? 'center' : 'flex-start',
            ...(isRoot && {
                padding: [
                    ['top', '10px'],
                    ['left', '10px'],
                    ['right', '10px'],
                    ['bottom', '10px'],
                ],
            }),
        },
    });

    const nestedContainers = sizes.map(
        (size) =>
            new CreateContainer({
                style: {
                    flexBasis: size + '%',
                    alignItems: 'stretch',
                    flexDirection: 'column',
                },
                media: {
                    mobile: {
                        style: {
                            flexBasis: '100%',
                        },
                    },
                },
            })
    );
    parentContainer.content.push(...nestedContainers);

    return parentContainer;
};

/**
 * Creates an array of containers with specified sizes.
 *
 * @param {object} options - The options for creating containers.
 * @param {number[]} options.size - the size in percentage for the container.
 * @returns {object[]} a container object.
 *
 * @example
 * const container = createContainer({ size: '100' });
 */
export const createContainer = ({ size }) => {
    const container = new CreateContainer({
        holder: 'container',
        style: {
            flexBasis: size + '%',
            alignItems: 'stretch',
            flexDirection: 'column',
        },
    });

    return container;
};

/**
 * Creates a section with a root container and child containers of specified sizes.
 *
 * @param {object} options - The options for creating the section and containers.
 * @param {number[]} options.sizes - An array of sizes in percentage for child containers.
 * @returns {object} The created section object.
 *
 * @example
 * const section = createWithSection({ sizes: [25, 50, 25] });
 */
export const createWithSection = ({ sizes }) => {
    const section = new CreateSection();
    const rootContainer = createContainers({ sizes, isRoot: true });

    section.content.push(rootContainer);

    return section;
};

/**
 * Generate containers based on the specified parameters.
 *
 * @param {object} options - The options for adding containers.
 * @param {string} options.cols - A string representing column sizes separated by '+'.
 * @param {string} options.addElType - The type of element to add ('SECTION', 'CONTAINER', etc.).
 * @param {string} options.editAddress - The address for editing the container.
 * @returns {object} The created container or section object.
 *
 * @example
 * // Add a root container with sizes 25%, 50%, 25%
 * const rootContainer = addContainers({
 *     cols: '25+50+25',
 *     addElType: 'CONTAINER',
 *     editAddress: '0.0',
 * });
 *
 * // Add a section with sizes 33.33%, 33.33%, 33.33%
 * const section = addContainers({
 *     cols: '33.33+33.33+33.33',
 *     addElType: 'SECTION',
 *     editAddress: '0.1',
 * });
 */
export const generateContainers = ({ cols, addElType, editAddress }) => {
    const sizes = cols.split('+').filter(Boolean);
    const editAddressArray = editAddress.split('.');
    const isRoot = editAddressArray.length === 2;

    if (isRoot) {
        return createContainers({ sizes, isRoot: true });
    }

    switch (addElType) {
        case 'SECTION':
            return createWithSection({ sizes });
        case 'CONTAINERS':
            return createContainers({ sizes: sizes });
        case 'CONTAINER':
            return createContainer({ size: sizes[0] || '100' });
        default:
            throw new Error('Element type does not match');
    }
};
