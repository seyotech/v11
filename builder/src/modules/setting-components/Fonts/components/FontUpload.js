import { useContext, useRef, useState } from 'react';
import { Input as AntdInput, Button, Upload } from 'antd';
import { ComponentRenderContext } from '@dorik/html-parser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import validateFiles from 'util/media/validateFiles';
import acceptedFileMeta from 'constants/acceptedFileMeta';
import { GroupContainer } from 'modules/Shared/GroupContainer';
import useManageMedia from 'hooks/media-library/useManageMedia';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { entityTypeEnum } from 'constants/mediaEntityTypeEnum';

function FontUpload({ name, value = {}, onChange }) {
    const [uploadType, setUploadType] = useState('');
    const { CDNDomain } = useContext(ComponentRenderContext);
    const { handleUploadMedia: uploadMedia, uploading } = useManageMedia();
    const ref = useRef();
    ref.current = onChange;

    const handleChange = (currentVal, type) => {
        onChange({ name, value: { ...value, [type]: currentVal } });
    };

    const handleUploadMedia = async ({ fileList, type }) => {
        const data = await uploadMedia({
            fileList,
            kind: 'font',
            entityType: entityTypeEnum.REGULAR,
        });
        // for getting the updated instance of `onChange` function instead of the memoized one
        ref.current({
            name,
            value: { ...value, [type]: `${CDNDomain}/${data[0].path}` },
        });
    };

    return (
        <GroupContainer className="custom-font">
            {['woff', 'woff2', 'ttf'].map((fontType, idx) => (
                <AntdInput
                    key={idx}
                    size="small"
                    onChange={(e) => handleChange(e.target.value, fontType)}
                    addonBefore={fontType.toUpperCase()}
                    className="font-input"
                    data-testid={fontType}
                    addonAfter={
                        <Upload
                            maxCount={1}
                            accept={`font/${fontType}`}
                            showUploadList={false}
                            beforeUpload={async (file, files) => {
                                const lastFile = files.at(-1);
                                if (file.uid === lastFile.uid) {
                                    const fileList = await validateFiles({
                                        files,
                                        accept: acceptedFileMeta['font'].type,
                                        size: acceptedFileMeta['font'].size,
                                        kind: 'font',
                                    });

                                    if (fileList.length < 1) return;

                                    handleUploadMedia({
                                        fileList,
                                        type: fontType,
                                    });
                                    setUploadType(fontType);
                                }
                            }}
                            customRequest={() => null}
                        >
                            <Button
                                className="btn"
                                loading={uploading && uploadType === fontType}
                                size="small"
                                icon={
                                    <FontAwesomeIcon
                                        icon={icon({
                                            name: 'upload',
                                            style: 'regular',
                                        })}
                                    />
                                }
                            />
                        </Upload>
                    }
                    value={value[fontType]}
                />
            ))}
        </GroupContainer>
    );
}

export default FontUpload;
