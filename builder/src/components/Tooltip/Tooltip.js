import T from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { ChildrenWrap, ContentWrap, TooltipWrap } from './Tooltip.stc';

function Tooltip({
    children,
    content,
    effect = 'click',
    placement = 'top',
    ...restOfProps
}) {
    const [isVisible, setVisibility] = useState(false);

    const handleMouseEnter = useCallback(() => {
        if (effect === 'hover') setVisibility(true);
    }, [effect]);

    const handleMouseLeave = useCallback(() => {
        if (effect === 'hover') setVisibility(false);
    }, [effect]);

    const toggleVisibility = useCallback(() => {
        if (effect === 'click') {
            isVisible ? setVisibility(false) : setVisibility(true);
        }
    }, [effect, isVisible]);

    useEffect(() => {
        if (effect === 'click') {
            function hideTooltip(e) {
                setVisibility(false);
            }
            window.addEventListener('click', hideTooltip);

            return window.removeEventListener('click', hideTooltip);
        }
    }, [effect]);

    return (
        <TooltipWrap
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            data-testid="tooltip-wrap"
            {...restOfProps}
        >
            {isVisible && (
                <ContentWrap position={placement}>{content}</ContentWrap>
            )}
            <ChildrenWrap data-testid="child-wrap" onClick={toggleVisibility}>
                {children}
            </ChildrenWrap>
        </TooltipWrap>
    );
}

Tooltip.propTypes = {
    content: T.any,
    effect: T.oneOf(['click', 'hover']),
    placement: T.oneOf([
        'top',
        'bottom',
        'bottom-left',
        'bottom-right',
        'left',
        'right',
        'top-left',
        'top-right',
    ]),
};

export default React.memo(Tooltip);
