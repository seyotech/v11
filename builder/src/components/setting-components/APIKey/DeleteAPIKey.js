import React, { useContext, useState } from 'react';
import { Button, Modal } from 'antd';
import { BuilderContext } from '../../../contexts/BuilderContext';

export function DeleteAPIKey({ value, service, onChange }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { siteId, useApiKeys } = useContext(BuilderContext);
    const { useDeleteApiKey } = useApiKeys();
    const credentialType = service === 'AIRTABLE' ? 'Token' : 'API Key';

    const { mutate, isLoading } = useDeleteApiKey({
        siteId,
        service,
        keyId: value,
    });

    const openDeleteModal = () => {
        if (!value) return;
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => setIsDeleteModalOpen(false);

    const handleDelete = async () => {
        await mutate({
            siteId,
            keyId: value,
        });
        closeDeleteModal();
        if (service === 'AIRTABLE') {
            onChange({
                name: 'airtable/configuration/keyId',
                value: null,
            });
        } else {
            onChange([
                {
                    name: 'settings/listId',
                    value: null,
                },
                {
                    name: 'settings/keyId',
                    value: null,
                },
            ]);
        }
    };

    return (
        <>
            <Button size="sm" type="danger-alt" onClick={openDeleteModal}>
                Delete {credentialType}
            </Button>
            <Modal
                title={`Delete ${credentialType}`}
                open={isDeleteModalOpen}
                onOk={handleDelete}
                confirmLoading={isLoading}
                onCancel={closeDeleteModal}
            >
                <p>Are you sure you want to delete the {credentialType}?</p>
            </Modal>
        </>
    );
}
