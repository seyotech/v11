import { useRef, useContext, forwardRef } from 'react';

import { InlineEditor } from './InlineEditor';
import { ElementContext } from 'contexts/ElementRenderContext';
import { COMPONENT_SETTINGS, INLINE_EDITOR } from '../../../../constants';

const refHandler = (node, ref) => {
    if (!ref || !node) return;

    if (typeof ref === 'function') {
        ref(node);
    }

    if ('current' in ref) {
        ref.current = node;
    }
};

const WithInlineEditor = forwardRef((props, ref) => {
    const { as: Tag = 'div', children, address, ...rest } = props;
    const editorRef = useRef();
    const elementRef = useRef();

    const {
        onClickSettings,
        showSettingsModal,
        currentEditAddress,
        settingsModalTriggerFrom,
    } = useContext(ElementContext);
    const _currentEditAddress = currentEditAddress();

    const isInlineEditorActive =
        settingsModalTriggerFrom === INLINE_EDITOR &&
        _currentEditAddress === address;

    const additionalProps = {};

    if (rest.strings) {
        additionalProps.dangerouslySetInnerHTML = {
            __html: rest.strings,
        };
    }

    const handleSingleClick = (event) => {
        event.stopPropagation();
        if (event.target.closest('a')) event.preventDefault();

        showSettingsModal(COMPONENT_SETTINGS, address, INLINE_EDITOR);
    };

    return isInlineEditorActive ? (
        <InlineEditor
            {...props}
            ref={editorRef}
            onClickSettings={onClickSettings}
        />
    ) : (
        <Tag
            {...rest}
            ref={(node) => {
                refHandler(node, ref);
                elementRef.current = node;
            }}
            onClick={handleSingleClick}
            {...additionalProps}
        >
            {children}
        </Tag>
    );
});

export default WithInlineEditor;
