import React from 'react';
import Button from '../../other-components/Button';
import Modal from '../Modals/Modal';
import { DragArea, ModalInner, Header, ModalBody } from './Colors.sc';

const ColorPickerModal = ({ children, close, position }) => {
    return (
        <Modal>
            <DragArea>
                <ModalInner
                    style={{
                        ...position,
                        position: 'fixed',
                    }}
                >
                    <Header>
                        Color Picker
                        <Button
                            size="sm"
                            type="none"
                            onClick={close}
                            icon={['far', 'times']}
                        />
                    </Header>
                    <ModalBody>{children}</ModalBody>
                </ModalInner>
            </DragArea>
        </Modal>
    );
};

export default ColorPickerModal;
