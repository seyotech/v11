/*****************************************************
 * Packages
 ******************************************************/
import { Modal } from 'antd';
import T from 'prop-types';
import { useRef, useState } from 'react';
import Draggable from 'react-draggable';

/*****************************************************
 * Locals
 ******************************************************/
import { ModalGlobalStyle, ModalWrapper } from '../Modal.stc';
import Footer from './Footer';
import useEditorModal from 'hooks/useEditorModal';

export const Float = ({ title, width, children, footer }) => {
    const {
        handleFloatModalPosition,
        floatModalPosition: { x = 0, y = 0 } = {},
    } = useEditorModal();

    const dragRef = useRef(null);
    const [scale, setScale] = useState(() =>
        Number(localStorage.getItem('__dorik_editor_modal_scale') || 1)
    );
    const [float, setFloat] = useState({
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        dragging: false,
    });

    const onStart = (_, { x, y }) => {
        const targetRect = dragRef.current?.getBoundingClientRect();
        if (!targetRect) return;

        const { clientWidth, clientHeight } = document.documentElement;
        const { height, width, top, left, right, bottom } = targetRect,
            halfWidth = width / 2,
            modalHeaderHeight = height - 50;

        setFloat({
            dragging: true,
            top: -top + y,
            left: -left + x - halfWidth,
            right: clientWidth + halfWidth - (right - x),
            bottom: clientHeight + modalHeaderHeight - (bottom - y),
        });
    };

    const onStop = (_, { x, y }) => {
        handleFloatModalPosition({ x, y });
        setFloat((float) => ({ ...float, dragging: false }));
    };

    return (
        <Modal
            style={{
                transition: 'transform 250ms',
                transform: `scale(${scale})`,
            }}
            open={true}
            mask={false}
            width={width}
            footer={null}
            title={title}
            closeIcon={false}
            rootClassName="draggable-modal"
            modalRender={(modal) => (
                <Draggable
                    defaultPosition={{ x, y }}
                    bounds={float}
                    nodeRef={dragRef}
                    handle=".handler"
                    onStart={onStart}
                    onStop={onStop}
                >
                    <ModalWrapper data-testid="draggable-modal" ref={dragRef}>
                        {modal}
                    </ModalWrapper>
                </Draggable>
            )}
        >
            {children}
            {footer ?? <Footer scale={scale} setScale={setScale} />}
            <ModalGlobalStyle dragging={float.dragging} />
        </Modal>
    );
};

Float.propTypes = {
    title: T.oneOfType([T.string, T.object]),
    width: T.number.isRequired,
    children: T.element.isRequired,
    footer: T.oneOfType([T.element, T.bool]),
};
