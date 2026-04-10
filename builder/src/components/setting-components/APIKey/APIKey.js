import { SelectInput } from 'modules/setting-components/Select';
import { useContext } from 'react';
import { BuilderContext } from '../../../contexts/BuilderContext';
import { EditorContext } from '../../../contexts/ElementRenderContext';
import { Spinner } from '../../other-components/Spinner';
import { AddAPIKey } from './AddAPIKey';
import { DeleteAPIKey } from './DeleteAPIKey';

export default function APIKey({
    name,
    value,
    handleKeyChange,
    onChange,
    service,
    onSuccess,
}) {
    const { currentEditItem } = useContext(EditorContext);
    const { siteId, useApiKeys } = useContext(BuilderContext);
    const { useGetApiKeys } = useApiKeys();
    const { data: APIKeys, isFetching } = useGetApiKeys({
        siteId,
        service: service ?? currentEditItem?.settings?.service,
    });
    const credentialType = service === 'AIRTABLE' ? 'Token' : 'API Key';

    const handleSuccess = (data) => {
        if (data?.keyId) {
            handleKeyChange({ name, value: data.keyId });
            if (typeof onSuccess === 'function') {
                onSuccess(data);
            }
        }
    };

    const changeKey = (value) => {
        handleKeyChange({
            name,
            value,
        });
    };

    const keysOptions = APIKeys?.map(({ keyId, name, censoredKey }) => ({
        key: keyId,
        value: keyId,
        label: `${name} (${censoredKey})`,
    }));

    return (
        <>
            {isFetching ? (
                <Spinner />
            ) : (
                <div>
                    <label htmlFor="list-id">
                        <strong>{credentialType}</strong>
                    </label>
                    <SelectInput
                        id="api-key"
                        module={{ label: 'API Key' }}
                        defaultValue={value ?? null}
                        onChange={changeKey}
                        style={{ marginBottom: 5, width: '100%' }}
                        loading={isFetching}
                        options={[
                            {
                                label: '- Select -',
                                value: null,
                                disabled: true,
                            },
                            ...keysOptions,
                        ]}
                    />
                </div>
            )}

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <AddAPIKey
                    siteId={siteId}
                    apiKeys={APIKeys}
                    service={service}
                    onSuccess={handleSuccess}
                />

                <DeleteAPIKey
                    value={value}
                    service={service}
                    onChange={onChange}
                />
            </div>
        </>
    );
}
