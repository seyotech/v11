import React, { useEffect, useCallback, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import PopoverStc, { Wrapper, PopoverBody, TriggerWrap } from './Popover.stc';

function Popover({
    title,
    trigger,
    content,
    children,
    placement,
    ...restOfProps
}) {
    const ref = useRef();
    const [visible, setVisible] = React.useState(false);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    });

    const handleClickOutside = useCallback(
        (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setVisible(false);
            }
        },
        [ref]
    );

    const triggerProps = useMemo(() => {
        if (trigger === 'hover') {
            return {
                onMouseEnter() {
                    setVisible(true);
                },
                onMouseLeave() {
                    setVisible(false);
                },
            };
        } else {
            return {
                onClick() {
                    setVisible(!visible);
                },
            };
        }
    }, [trigger, visible]);

    const close = useCallback(() => setVisible(false), [setVisible]);

    return (
        <Wrapper {...restOfProps} ref={ref}>
            <TriggerWrap {...triggerProps}>{children}</TriggerWrap>
            {visible && (
                <PopoverStc placement={placement}>
                    <span className="caret" />
                    <PopoverBody>
                        {typeof content === 'function'
                            ? content(null, close)
                            : content}
                    </PopoverBody>
                </PopoverStc>
            )}
        </Wrapper>
    );
}

Popover.propTypes = {
    title: PropTypes.string,
    trigger: PropTypes.string,
    placement: PropTypes.string,
    content: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.object,
    ]),
};

export default React.memo(Popover);
