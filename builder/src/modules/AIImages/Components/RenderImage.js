import React from 'react';
import { AIImage } from '../imageGenerator.stc';
import { Button, Flex, Image } from 'antd';
import { useTranslation } from 'react-i18next';
import { LoadingOutlined } from '@ant-design/icons';

function RenderImage({
    image = {},
    handleClick,
    isLoading,
    loading,
    uploadedImgs,
    handleInsertImage,
}) {
    const { t } = useTranslation('builder');
    const disabled = uploadedImgs.some((img) => img.id === image.id) || loading;

    return (
        <AIImage
            key={image.id}
            height={image.orient === 'landscape' ? '150px' : '200px'}
        >
            <Image
                src={image.src}
                alt=""
                width="100%"
                height="100%"
                preview={true}
                style={{ objectFit: 'cover' }}
                placeholder={
                    <Flex
                        align="center"
                        justify="center"
                        style={{ height: '100%' }}
                    >
                        <LoadingOutlined />
                    </Flex>
                }
            />
            <div className="hover-content">
                <Button
                    size="small"
                    type="primary"
                    disabled={isLoading}
                    onClick={() => handleInsertImage(image)}
                >
                    {t('Insert')}
                </Button>
                <Button
                    size="small"
                    disabled={disabled}
                    loading={isLoading}
                    onClick={() => handleClick(image)}
                    type="primary"
                >
                    {t('Add to Library')}
                </Button>
            </div>
        </AIImage>
    );
}

export default RenderImage;
