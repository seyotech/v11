import { Fragment } from 'react';

import { DropHighlighter, getAccessibleAttributes } from 'components/DnD.Stc';
import { generateControlStyles } from '../utils/generateControlStyles';
import { ControlBoundary } from './ControlBoundary';

export const RenderContainerOrDescendant = (props) => {
    const {
        item,
        isOver,
        canDrop,
        children,
        direction,
        isBorderActive,
        renderControlProps,
    } = props;

    const { ['data-testid']: testId, ...controlProps } = renderControlProps;

    const renderControl = () => {
        return (
            <ControlBoundary {...props}>
                <DropHighlighter
                    itemType={item.type}
                    data-testid={testId}
                    direction={direction}
                    {...getAccessibleAttributes({
                        isOver,
                        canDrop,
                        itemType: item.type,
                    })}
                />
            </ControlBoundary>
        );
    };

    return (
        <Fragment>
            {generateControlStyles({ ...item, isBorderActive })}
            {children({
                control: {
                    props: controlProps,
                    render: renderControl,
                },
            })}
        </Fragment>
    );
};
