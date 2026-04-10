import { Form, Input, Modal } from 'antd';
import cloneDeep from 'lodash/cloneDeep';
import React from 'react';
import uuid from '../../util/uniqId';
import { useTranslation } from 'react-i18next';

function SaveGlobalModal({ close, visible, onSave, data }) {
    const [name, setName] = React.useState('');
    const { t } = useTranslation();
    const handleSave = React.useCallback(() => {
        const symbolId = uuid();
        const symbol = {
            name,
            id: symbolId,
            data: cloneDeep(data),
        };
        onSave({ symbolId, symbol, cb: close });
        setName('');
    }, [data, name, onSave, close]);
    return (
        <Modal
            onCancel={close}
            open={visible}
            onOk={handleSave}
            okText={t('Save')}
            okButtonProps={{ disabled: !name.trim() }}
            cancelText={t('Close')}
            title={t('Save as Symbol')}
        >
            <Form layout="vertical">
                <Form.Item label={t('Name')}>
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

export default SaveGlobalModal;
