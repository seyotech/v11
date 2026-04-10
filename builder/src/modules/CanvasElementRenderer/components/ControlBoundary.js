import { Fragment } from 'react';

import ElementControl from 'components/ElementControl';
import { Borders } from './Borders';
import SpacingBoundaries from './SpacingBoundaries/SpacingBoundaries';

export const ControlBoundary = (props) => {
    const {
        item,
        color,
        siteId,
        address,
        parentType,
        renderBorder,
        controlVisible,
        connectDragSource,
        isTextEditorActive,
        setControlVisibility,
        freezeControlVisibility,
    } = props;
    return (
        <Fragment>
            {controlVisible && (
                <ElementControl
                    item={item}
                    parentType={parentType}
                    connectDragSource={connectDragSource}
                    freezeControlVisibility={freezeControlVisibility}
                    className={isTextEditorActive ? 'hidden' : null}
                    setControlVisibility={setControlVisibility}
                    isSymbol={!!item.symbolId}
                    layer={address.length}
                    address={address}
                    siteId={siteId}
                    color={color}
                />
            )}
            {props.children}
            {renderBorder && (
                <>
                    <Borders color={color} />
                    <SpacingBoundaries
                        color={color}
                        address={address}
                        item={item}
                    />
                </>
            )}
        </Fragment>
    );
};
