import { ComponentRenderContext } from '@dorik/html-parser';
import { forwardRef, useContext } from 'react';

const refHandler = (node, ref) => {
    if (!ref || !node) return;

    if (typeof ref === 'function') {
        ref(node);
    }

    if ('current' in ref) {
        ref.current = node;
    }
};

export const WithTyping = forwardRef((props, ref) => {
    const {
        typekey,
        strings,
        shouldType,
        children,
        as: Tag = 'div',
        status,
        ...rest
    } = props;

    const { startTyping } = useContext(ComponentRenderContext);

    const typeHandler = startTyping({
        strings,
        typekey,
        status,
    });

    return (
        <Tag
            {...rest}
            ref={(node) => {
                if (node) {
                    typeHandler(node);
                    refHandler(node, ref);
                }
            }}
        >
            {/* <TypeWriterLoading /> */}
        </Tag>
    );
});
