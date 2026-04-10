import { Button, Input, Modal, Space, notification } from 'antd';
import { SelectInput } from 'modules/setting-components/Select';
import { useContext, useEffect, useState } from 'react';
import { BuilderContext } from '../../../contexts/BuilderContext';

export function AddAPIKey({ apiKeys, siteId, onSuccess, service }) {
    const { useApiKeys } = useContext(BuilderContext);
    const { useCreateApiKey } = useApiKeys();
    const [visible, setVisible] = useState(false);
    const [key, setKey] = useState('');
    const [name, setName] = useState('');
    const [metaData, setMetaData] = useState('');
    const [secret, setSecret] = useState('');
    const [mailerLiteAPIVersion, setMailerLiteAPIVersion] = useState('NEW_V2');
    const { mutate, data, isSuccess, isFetching } = useCreateApiKey({
        siteId,
        service,
    });
    const credentialType = service === 'AIRTABLE' ? 'Token' : 'API Key';

    const openModal = () => setVisible(true);
    const closeModal = () => setVisible(false);

    const handleAddNewApi = async () => {
        if (!key.trim()) {
            notification.error({
                message: `Please enter a valid ${credentialType}.`,
                placement: 'top',
            });
            return;
        }
        const meta =
            JSON.stringify(
                {
                    MAIL_CHIMP: `{ "server": "${metaData}" }`,
                    ACTIVE_CAMPAIGN: `{ "accountName": "${metaData}" }`,
                    MAILER_LITE: `{ "apiVersion": "${mailerLiteAPIVersion}" }`,
                }[service]
            ) ?? '';
        const input = {
            key: key.trim(),
            service,
            projectId: siteId,
            secret: secret.length > 0 ? secret : 'secret',
            meta,
            name: name || `${service}_API_KEY_${apiKeys.length + 1}`,
        };
        await mutate(input);
        closeModal();
        setMetaData('');
        setKey('');
        setName('');
    };

    useEffect(() => {
        if (isSuccess && data) {
            onSuccess(data);
        }
    }, [isSuccess, data]);

    return (
        <>
            <Button size="sm" type="primary-alt" onClick={openModal}>
                Add New {credentialType}
            </Button>

            <Modal
                width={400}
                dropShadow
                title={`Add New ${credentialType}`}
                open={visible}
                onCancel={closeModal}
                centered
                footer={
                    <div>
                        <Button type="link" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddNewApi} loading={isFetching}>
                            Save
                        </Button>
                    </div>
                }
            >
                <Space
                    direction="vertical"
                    size="middle"
                    style={{ display: 'flex' }}
                >
                    <Input
                        size="middle"
                        placeholder="Name"
                        value={name}
                        onChange={({ target }) => setName(target.value)}
                    />
                    <Input
                        size="middle"
                        placeholder={`${credentialType}`}
                        value={key}
                        onChange={({ target }) => setKey(target.value)}
                    />

                    {service === 'ACTIVE_CAMPAIGN' && (
                        <Input
                            size="middle"
                            placeholder="Active Campaign Account Name"
                            value={metaData}
                            onChange={({ target }) => setMetaData(target.value)}
                        />
                    )}

                    {service === 'MAIL_JET' && (
                        <Input
                            size="middle"
                            placeholder="API Secret Key"
                            value={secret}
                            onChange={({ target }) => setSecret(target.value)}
                        />
                    )}

                    {service === 'MAIL_CHIMP' && (
                        <Input
                            size="middle"
                            placeholder="Server"
                            value={metaData}
                            onChange={({ target }) => setMetaData(target.value)}
                        />
                    )}

                    {service === 'MAILER_LITE' && (
                        <SelectInput
                            defaultValue={mailerLiteAPIVersion}
                            onChange={setMailerLiteAPIVersion}
                            options={[
                                { label: 'NEW', value: 'NEW_V2' },
                                { label: 'Classic', value: 'CLASSIC_V1' },
                            ]}
                        />
                    )}
                </Space>
            </Modal>
        </>
    );
}
