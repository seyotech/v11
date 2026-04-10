/*****************************************************
 * Packages
 ******************************************************/
import html2canvas from 'html2canvas';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Input,
    Modal,
    Form,
    Radio,
    Flex,
    Button,
    Space,
    Select,
    notification,
} from 'antd';
/*****************************************************
 * Locals
 ******************************************************/
import { EL_TYPES } from '../../constants/index';
import { capitalize } from '../../util/capitalize';
import { getElementClass } from '../../util/getClassName';
import { BuilderContext } from '../../contexts/BuilderContext';
import { ImagePreview } from 'modules/setting-components/Upload';
import { entityTypeEnum } from 'constants/mediaEntityTypeEnum';

const SaveElementModal = ({ onClose, data, visible, elRef }) => {
    const [thumbnail, setThumbnail] = React.useState('');
    const [confirmLoading, setConfirmLoading] = React.useState(false);

    const { t } = useTranslation('builder');
    const { user, saveElement, handleUploadMedia, CDNDomain } =
        useContext(BuilderContext);

    const isAdmin = user?.role === 'sys_admin';

    async function canvasFile(canvas, imageName, type) {
        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    const file = new File([blob], imageName, {
                        type: type,
                    });
                    resolve(file);
                },
                'image/webp',
                0.3
            );
        });
    }

    const takeAutomaticScreenshot = async ({ title }) => {
        if (!elRef.current) return '';
        const className = getElementClass(data).split(' ')[0];
        const selector =
            elRef.current.querySelector(`.${className}`) || elRef.current;
        const styleDiv = document.createElement('div');
        styleDiv.setAttribute('style', 'font-family: system-ui !important;');
        selector.insertAdjacentElement('afterbegin', styleDiv);
        const h2canv = await html2canvas(selector);
        return canvasFile(h2canv, `${title}.webp`, 'image/webp');
    };

    const uploadScreenshot = async (file) => {
        try {
            const [result] = await handleUploadMedia({
                fileList: [file],
                kind: 'image',
                entityType: entityTypeEnum.SYSTEM,
            });
            return `${CDNDomain}/${result.path}`;
        } catch (err) {
            notification.error({
                message: t('Screenshot not uploaded'),
                placement: 'bottomRight',
                duration: 10,
            });
        }
    };

    const handleSave = React.useCallback(
        async ({ title, tags, isPrivate }) => {
            try {
                setConfirmLoading(true);
                const thumbStr = isAdmin
                    ? thumbnail
                    : await uploadScreenshot(
                          await takeAutomaticScreenshot({ title })
                      );

                await saveElement({
                    title,
                    tags,
                    isPrivate,
                    ...(thumbStr && { thumbnail: thumbStr }),
                    user: user.id,
                    type: [EL_TYPES.ROW, EL_TYPES.CMSROW].includes(data._elType)
                        ? EL_TYPES.ROW
                        : data._elType,
                    data: JSON.stringify(data),
                });
                setConfirmLoading(false);
                setThumbnail('');
                onClose();
            } catch (error) {
                setConfirmLoading(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [data, user, onClose, thumbnail, elRef]
    );

    const handleUpload = ({ value }) => {
        setThumbnail(value);
    };

    if (!data) return null;

    return (
        <Modal
            dropShadow
            width={400}
            footer={null}
            open={visible}
            onCancel={onClose}
            title={capitalize(t(`Save {{elName}}`, { elName: data.name }))}
        >
            <Form layout="vertical" size="small" onFinish={handleSave}>
                <Form.Item
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                    name="title"
                >
                    <Input placeholder={t('Title')} disabled={!user} />
                </Form.Item>
                {isAdmin && (
                    <>
                        <Form.Item label={t('Tags')} name="tags">
                            <Select mode="tags" />
                        </Form.Item>
                        <Form.Item label={t('Thumbnail')}>
                            <ImagePreview
                                name="thumbnail"
                                accept="image/*"
                                value={thumbnail}
                                onChange={handleUpload}
                                entityType={entityTypeEnum.SYSTEM}
                            />
                        </Form.Item>
                        <Form.Item label={t('Make public')} name="isPrivate">
                            <Radio.Group
                                type="inline"
                                options={[
                                    { label: 'Yes', value: false },
                                    { label: 'No', value: true },
                                ]}
                            />
                        </Form.Item>
                    </>
                )}
                <Flex justify="flex-end">
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button
                            type="primary"
                            disabled={!user}
                            htmlType="submit"
                            loading={confirmLoading}
                        >
                            Save
                        </Button>
                    </Space>
                </Flex>
                <br />
            </Form>
        </Modal>
    );
};

export default React.memo(SaveElementModal);
