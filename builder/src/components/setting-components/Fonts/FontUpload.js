import { Input as AntdInput, notification, Upload } from 'antd';
import React, { useCallback, useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { BuilderContext } from '../../../contexts/BuilderContext';

function FontUpload({ name, value = {}, onChange }) {
    const [isUploading, setUploading] = useState({});
    const { fileUploader } = useContext(BuilderContext);

    const handleFileUpload = (info, type) => {
        setUploading((prev) => {
            return { ...prev, [type]: true };
        });
        if (info.file.status === 'done') {
            onChange({
                name,
                value: { ...value, [type]: info.file.response.url },
            });

            setUploading((prev) => {
                return { ...prev, [type]: false };
            });
        }
    };
    const handleChange = (e, type) => {
        e.persist();
        const currentVal = e.target?.value;
        onChange({ name, value: { ...value, [type]: currentVal } });
    };

    const hanldeCustomRequest = useCallback(async ({ file, onSuccess }) => {
        try {
            const { data } = await fileUploader(file);
            data && onSuccess(data.file);
        } catch (error) {
            notification.open({ message: 'Something went wrong' });
            onSuccess({});
        }
    }, []);

    return (
        <div className="custom-font">
            {['woff', 'woff2', 'ttf'].map((input, idx) => (
                <AntdInput
                    key={idx}
                    style={{ marginTop: 10 }}
                    addonBefore={input?.toUpperCase()}
                    onChange={(e) => handleChange(e, input)}
                    className="font-input"
                    size="middle"
                    addonAfter={
                        <Upload
                            maxCount={1}
                            showUploadList={false}
                            customRequest={hanldeCustomRequest}
                            onChange={(e) => handleFileUpload(e, input)}
                        >
                            <button
                                className="btn"
                                style={{ padding: '1px 10px' }}
                            >
                                {isUploading[input] ? (
                                    <FontAwesomeIcon
                                        spin
                                        fixedWidth
                                        icon={['far', 'spinner']}
                                    />
                                ) : (
                                    <FontAwesomeIcon icon={['far', 'upload']} />
                                )}
                            </button>
                        </Upload>
                    }
                    value={value[input]}
                />
            ))}
        </div>
    );
}

export default FontUpload;
