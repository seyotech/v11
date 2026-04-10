import styled from 'styled-components';

import { DND_TYPES } from '../constants/index';

function showDroppableArea(props) {
    const { itemType, theme, direction } = props;

    const elColor = theme.elementControls[itemType];
    const color = elColor ? elColor.bg : theme.elementControls.default.bg;

    const borderStyle = `1px dashed ${color}`;

    return {
        [`border-${direction}`]: borderStyle,
    };
}

const showActiveDropArea = ({ direction }) => ({
    [`border-${direction}`]: '5px solid #3a30ba',
});

export const ItemWrapper = styled.div`
    position: relative;
    max-width: 100%;
    opacity: ${({ $isDragging }) => ($isDragging ? 0.2 : 1)};
    &[role$='-drop-area'] {
        ${showDroppableArea};
    }
    &[role$='-drop-area-active'] {
        ${showActiveDropArea};
    }
`;

export const DropHighlighter = styled(ItemWrapper)`
    inset: 0;
    opacity: 1;
    position: absolute;
    pointer-events: none;
`;

export const getAccessibleAttributes = ({ canDrop, isOver, itemType }) => {
    if (!canDrop) return {};

    const type = Object.values(DND_TYPES).includes(itemType)
        ? itemType
        : DND_TYPES.COMPONENT;
    let role = `${type}-drop-area`;

    if (isOver) {
        role += '-active';
    }
    const accessibleAttributes = {
        role,
    };

    return accessibleAttributes;
};
