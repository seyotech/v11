import React from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
function RemoveGlobalModal({ unlink, visible, close }) {
    const { t } = useTranslation();
    const handleOk = React.useCallback(
        (e) => {
            unlink(close);
        },
        [unlink, close]
    );
    return (
        <Modal
            onOk={handleOk}
            okText={t('Yes')}
            cancelText={t('No')}
            onCancel={close}
            open={visible}
            title={t('Unlink Symbol Element')}
        >
            <p>
                {t(
                    'Are you sure you want to unlink symbol element? No worries, Regular element will keep the styles!'
                )}
            </p>
        </Modal>
    );
}

export default RemoveGlobalModal;
