import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Popconfirm, Typography } from 'antd';
import { useGetFileURL } from 'modules/Shared/hooks/useGetFileURL';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ucFirst from 'util/ucFirst';
import { MediaOverlay, PreviewAreaStc, ReplaceImage } from './Upload.stc';

export const PreviewArea = ({
    type,
    inputURL,
    openMedia,
    handleRemoveMedia,
}) => {
    const [open, setOpen] = useState();
    const getFileURL = useGetFileURL();
    const { t } = useTranslation('builder');

    const Previewer = type === 'image' ? 'img' : 'video';

    return (
        <PreviewAreaStc
            onMouseEnter={() => {
                setOpen(!!inputURL);
            }}
            onMouseLeave={() => {
                setOpen(false);
            }}
        >
            {inputURL ? (
                <>
                    {open && (
                        <Popconfirm
                            title={t(`Remove the {{type}}`, { type })}
                            description={t(
                                `Are you sure to Remove this {{type}}`,
                                { type }
                            )}
                            onConfirm={handleRemoveMedia}
                            okText={t('Yes')}
                            cancelText={t('No')}
                            placement="left"
                        >
                            <span className="remove">
                                <FontAwesomeIcon
                                    fixedWidth
                                    data-testid="remove-preview"
                                    icon={regular('trash')}
                                />
                            </span>
                        </Popconfirm>
                    )}

                    <Previewer
                        alt={t('Preview')}
                        src={getFileURL(inputURL)}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center',
                        }}
                        controls={type === 'video'}
                    />
                    <MediaOverlay
                        onClick={openMedia}
                        style={{
                            opacity: Number(open) || 0,
                        }}
                    >
                        <ReplaceImage>
                            <Typography.Text>
                                {t('Replace {{type}}', { type: ucFirst(type) })}
                            </Typography.Text>
                        </ReplaceImage>
                    </MediaOverlay>
                </>
            ) : (
                <Button size="small" onClick={openMedia}>
                    {t('Upload {{type}}', { type: ucFirst(type) })}
                </Button>
            )}
        </PreviewAreaStc>
    );
};
