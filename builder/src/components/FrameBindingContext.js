import React, { useRef } from 'react';
import { useDragDropManager } from 'react-dnd';
import { StyleProvider } from '@ant-design/cssinjs';
import { FrameContextConsumer } from 'react-frame-component';
import { StyleSheetManager } from 'styled-components';

// import { useScrollOnDrag } from 'modules/Shared/hooks/useScrollOnDrag';

const FrameBindingContext = ({ children }) => {
    const dragDropManager = useDragDropManager();
    const isBackendInitialized = useRef(null);

    // note: comment for testing builder crash issue
    // useScrollOnDrag();
    return (
        <FrameContextConsumer>
            {({ window, document }) => {
                // preventing adding backend multiple times.
                if (!isBackendInitialized.current) {
                    const backend = dragDropManager.getBackend();
                    backend.addEventListeners(window);
                    isBackendInitialized.current = true;
                }

                return (
                    <StyleSheetManager target={document.head}>
                        <StyleProvider autoClear container={document.head}>
                            {children}
                        </StyleProvider>
                    </StyleSheetManager>
                );
            }}
        </FrameContextConsumer>
    );
};

export default FrameBindingContext;
