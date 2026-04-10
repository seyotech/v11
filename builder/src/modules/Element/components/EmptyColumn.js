/*****************************************************
 * Packages
 ******************************************************/
import { useContext } from 'react';

/*****************************************************
 * Locals
 ******************************************************/
import { ElementContext } from 'contexts/ElementRenderContext';
import { EmptyBlocks } from 'modules/Element/components/EmptyBlock';
import { DND_TYPES } from '../../../constants';
import { columnBlocks, columnTypeEnums } from '../data/elements';

const { ROW, COLUMN, CMS_ROW } = DND_TYPES;
const { REGULAR_ROW_COLUMN, CMS_ROW_COLUMN, NESTED_ROW_COLUMN } =
    columnTypeEnums;

/**
 * Render the empty column blocks.
 *
 * @param {object} options - The options object containing the column's properties.
 * @param {string} options.type - The type of the column.
 * @param {string} options.parentType - The type of the column's parent.
 * @param {object} options.nestedEl - The nested element within the column.
 * @returns {object} - The rendered empty column element.
 */
function EmptyColumn({ type, parentType, nestedEl }) {
    const { addColumn } = useContext(ElementContext);
    const isCmsRow = type === CMS_ROW;

    let columnType = REGULAR_ROW_COLUMN;

    if (type === ROW && parentType === COLUMN) {
        columnType = NESTED_ROW_COLUMN;
    }

    if (isCmsRow) {
        columnType = CMS_ROW_COLUMN;
    }

    // Get the appropriate blocks based on the column type
    const blocks = columnBlocks[columnType];

    // Function to handle adding column
    const handleAddBlock = (block) => {
        addColumn(block, { nestedEl, cmsRow: isCmsRow });
    };

    const lighten = new RegExp(type, 'gi').test(COLUMN);

    return (
        <EmptyBlocks
            blocks={blocks}
            lighten={lighten}
            onAddBlock={handleAddBlock}
        />
    );
}

export default EmptyColumn;
