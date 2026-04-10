import React from 'react';
import { Modal, Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';

function RenameElementModal({ close, visible, onSave, data }) {
    const [name, setName] = React.useState(data?.name || '');
    const { t } = useTranslation();
    const handleSave = React.useCallback(() => {
        const payload = {
            name: 'name',
            value: name,
        };
        onSave(payload);
        close();
    }, [close, name, onSave]);
    return (
        <Modal
            onCancel={close}
            open={visible}
            onOk={handleSave}
            okText={t('Save')}
            okButtonProps={{ disabled: !name.trim() }}
            cancelText={t('Close')}
            title={
                <span style={{ textTransform: 'capitalize' }}>
                    {t(`Rename {{elName}}`, { elName: data?.type })}
                </span>
            }
        >
            <Form layout="vertical">
                <Form.Item label={t('New Name')}>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        size="large"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default RenameElementModal;
