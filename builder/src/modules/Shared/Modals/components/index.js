import { Modal } from 'antd';
import AddCustomDomain from './AddCustomDomain';
import PageNameSlug from './PageNameSlug';

const modals = {
    changeNameAndSlug: PageNameSlug,
    customDomain: AddCustomDomain,
};

function BaseModal({ type, onCancel, ...rest }) {
    const ModalComp = modals[type];
    if (!ModalComp) return null;

    return (
        <Modal
            {...rest}
            centered
            destroyOnClose="true"
            data-testid="base-modal"
            onCancel={onCancel}
            footer={null}
        >
            <ModalComp {...rest} close={onCancel} />
        </Modal>
    );
}

export default BaseModal;
