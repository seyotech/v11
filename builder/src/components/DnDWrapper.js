import { DND_TYPES } from 'constants';
import { ControlBoundary } from 'modules/CanvasElementRenderer/components/ControlBoundary';
import { RenderContainerOrDescendant } from '../modules/CanvasElementRenderer/components/RenderContainerOrDescendant';
import { ItemWrapper, getAccessibleAttributes } from './DnD.Stc';

export const DnDWrapper = (props) => {
    const {
        item,
        isOver,
        canDrop,
        children,
        direction,
        parentType,
        isDragging,
        wrapperClass,
        renderControlProps,
    } = props;

    const isContainerOrDescendant = [parentType, item.type].includes(
        DND_TYPES.CONTAINER
    );

    if (isContainerOrDescendant)
        return <RenderContainerOrDescendant {...props} />;

    const { style, ...controlProps } = { ...renderControlProps };

    return (
        <ItemWrapper
            // isOver={isOver}
            itemType={item.type}
            direction={direction}
            $isDragging={isDragging}
            className={wrapperClass.trim()}
            {...getAccessibleAttributes({
                isOver,
                canDrop,
                itemType: item.type,
            })}
            {...controlProps}
        >
            <ControlBoundary {...props}>{children()}</ControlBoundary>
        </ItemWrapper>
    );
};
