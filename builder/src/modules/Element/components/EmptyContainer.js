import { useContext } from 'react';

import { ElementContext } from 'contexts/ElementRenderContext';
import { EmptyBlocks } from 'modules/Element/components/EmptyBlock';
import { generateCols } from 'modules/Element/utils/element';
import { DND_TYPES } from '../../../constants';
import { containerBlocks, containerTypeEnums } from '../data/elements';

const { SINGLE, MULTI } = containerTypeEnums;

/**
 * Render an empty container with blocks to add to the container.
 *
 * @param {Object} props - The properties for the EmptyContainer component.
 * @param {string} props.type - The type of container: 'CONTAINER' or 'CONTAINERS' OR 'SECTION'.
 * @param {Function} props.onChange - Will be used for onChange functionality
 * @param {string} props.selectedBlock - The selected block that will be used for showing active style
 *
 * @returns {JSX.Element} The JSX element representing the empty container with blocks.
 *
 *
 * @example
 * // Example usage of EmptyContainer component
 * <EmptyContainer type="CONTAINER" />
 *
 */
function EmptyContainer(props) {
    const { type, onChange, selectedBlock } = props;
    const { addContainers } = useContext(ElementContext);

    // Function to handle adding container
    const handleAddBlock = (block) => {
        const cols = generateCols(block);
        const payload = { cols, addElType: type };
        if (typeof onChange === 'function') {
            onChange(payload);
        } else {
            addContainers(payload);
        }
    };
    const lighten = new RegExp(type, 'gi').test(DND_TYPES.CONTAINER);

    return (
        <EmptyBlocks
            showText
            blocks={containerBlocks}
            lighten={lighten}
            onAddBlock={handleAddBlock}
            selectedBlock={selectedBlock}
        />
    );
}

export default EmptyContainer;
