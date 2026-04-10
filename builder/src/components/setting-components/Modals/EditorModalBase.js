/*****************************************************
 * Packages
 ******************************************************/
import React, { useEffect, useState } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import styled, { css } from 'styled-components';

/*****************************************************
 * Locals
 ******************************************************/
import Modal from './Modal';
import ModalHeader from './ModalHeader';
import useClickOutside from './../../../hooks/useClickOutside';
import { NAVIGATION_TREE } from '../../../constants';

function getSize({ size }) {
    switch (size) {
        case 'md': {
            return css`
                width: 800px;
            `;
        }
        case 'lg': {
            return css`
                width: 930px;
            `;
        }
        case 'sm':
        default:
            return css`
                width: 360px;
            `;
    }
}

const ModalDropzone = styled.div`
    width: 100%;
    height: 100%;
`;

const ModalWrapper = styled.div`
    height: 650px;
    overflow: hidden;
    max-height: 650px;
    position: absolute;
    border-radius: 5px;
    box-shadow: 0 0 60px 0 rgba(43, 53, 86, 0.15);
    transition: all 0.3s ease-in-out;
    background: ${({ theme }) => theme.modalBg};
    &.animated {
        animation: editorModalAnimation 0.3s linear;
    }
    @keyframes editorModalAnimation {
        0% {
            transform: ${({ modalScale }) => `scale(${modalScale - 0.1})`};
        }
        100% {
            transform: ${({ modalScale }) => `scale(${modalScale})`};
        }
    }

    ${getSize};
`;

const ModalFooter = styled.div`
    display: flex;
    padding: 15px 30px;
    align-items: center;
    border-radius: 0 0 5px 5px;
    justify-content: space-between;
    background: ${({ theme }) => theme.primary.bg};
    border-top: 2px solid ${({ theme }) => theme.inputBorder};

    .undo-redo {
        padding-left: 8px;
        padding-right: 8px;
    }

    .icon {
        color: ${({ theme }) => theme.primary.fg};
    }
`;

const EditorModalBase = (props) => {
    const {
        title,
        close,
        children,
        style = {},
        size = 'sm',
        tabs = null,
        footer = null,
        hasBackdrop = true,
        activeSidebar,
        isRenameable,
        ...rest
    } = props;

    const [position, setPosition] = useState({
        top: 80,
        left: activeSidebar === NAVIGATION_TREE ? 400 : 80,
    });
    const [isDraggings, setDragging] = useState(false);
    const Ref = useClickOutside(close);

    useEffect(() => {
        if (activeSidebar === NAVIGATION_TREE) {
            if (position.left < 400) {
                setPosition((prev) => ({
                    ...prev,
                    left: 400,
                }));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSidebar]);

    const [, drop] = useDrop({
        accept: 'MODAL',
        drop(item, monitor) {
            const delta = monitor.getDifferenceFromInitialOffset();
            const left = Math.round(item.left + delta.x);
            const top = Math.round(item.top + delta.y);
            setPosition({ left, top });
            return undefined;
        },
    });

    const [{ isDragging }, drag, preview] = useDrag({
        type: 'MODAL',
        item: { left: position.left, top: position.top },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    React.useEffect(() => {
        const closeModal = (e) => {
            if (e.keyCode === 27) {
                close();
            }
        };
        window.addEventListener('keydown', closeModal);
        return () => window.removeEventListener('keydown', closeModal);
    }, [close]);

    const opacity = isDragging ? 0 : 1;

    return (
        <Modal isDragging={isDragging} hasBackdrop={hasBackdrop}>
            <ModalDropzone ref={drop}>
                <div>
                    <ModalWrapper
                        size={size}
                        ref={preview}
                        style={{ ...position, opacity, ...style }}
                        className={rest.animatClass}
                        onAnimationEnd={rest.onAnimationEnd}
                        {...rest}
                    >
                        <ModalHeader
                            ref={drag}
                            size={size}
                            close={close}
                            isRenameable={isRenameable}
                            title={title}
                            {...rest}
                        />
                        {tabs}
                        {isDraggings ? null : <div>{children}</div>}
                        {footer && <ModalFooter>{footer}</ModalFooter>}
                    </ModalWrapper>
                </div>
            </ModalDropzone>
        </Modal>
    );
};

export default React.memo(EditorModalBase);
