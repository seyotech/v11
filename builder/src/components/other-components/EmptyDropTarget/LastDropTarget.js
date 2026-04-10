import useDnD from '../../../hooks/useDnD';
import {
    ItemWrapper,
    getAccessibleAttributes,
} from '../../../components/DnD.Stc';

const dropStyle = ({ itemType, canDrop }) => {
    const direction = itemType === 'column' ? 'width' : 'height';
    return {
        [direction]: canDrop ? '12px' : '0',
    };
};

const LastDropTarget = (props) => {
    const { isOver, canDrop, connectDropTarget } = useDnD(props);

    const isActive = isOver && canDrop;

    return (
        <ItemWrapper
            itemType={props.type}
            data-testid={`${props.type}-last-drop-area`}
            ref={connectDropTarget}
            {...getAccessibleAttributes({
                isOver,
                canDrop,
                itemType: props.type,
            })}
            isActive={isActive}
            style={{ ...dropStyle({ itemType: props.type, canDrop }) }}
        />
    );
};

export default LastDropTarget;
