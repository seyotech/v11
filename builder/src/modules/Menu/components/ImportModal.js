import { Form, Modal, Radio, Space, Typography } from 'antd';
import { useContext, useState } from 'react';

import { EditorContext } from 'contexts/ElementRenderContext';
import { useTranslation } from 'react-i18next';
import useImport from '../hooks/useImport';
import { handleDuplicateHome, handleDuplicatePage } from '../utils/menu';
import { AntAlert } from './Menu.stc';

export const ImportModal = ({ open, closeModal }) => {
    const { t } = useTranslation('builder');
    const { importJSON } = useContext(EditorContext);
    const [keep, setKeep] = useState(true);
    const { setIds, setImport, oldPages, state } = useImport();
    const { json } = state;

    const handleSubmit = () => {
        let pages = [...json.pages];
        let global = json.global;
        const homePage = pages.find(
            (page) => page.pageType === 'HOMEPAGE' || page.type === 'INDEX'
        );

        if (keep) {
            pages.forEach((page) => {
                const { slug } = page;
                const isHomePage =
                    page.pageType === 'HOMEPAGE' || page.type === 'INDEX';
                if (isHomePage) handleDuplicateHome(page, pages, oldPages);
                const pageWithSameSlug = oldPages.find(
                    (page) => page.slug === slug
                );
                if (!isHomePage && pageWithSameSlug)
                    handleDuplicatePage(page, pages, oldPages);
                return { ...page, type: 'REGULAR' };
            });

            pages = pages.concat(oldPages);
            global = undefined;
        } else {
            const templates = oldPages.filter(
                (page) => page.pageType === 'TEMPLATE'
            );
            const regularPageIds = oldPages
                .filter((page) => page.pageType !== 'TEMPLATE')
                .map((page) => page.id);

            setIds(regularPageIds);

            homePage.slug = 'index';
            homePage.type = 'INDEX';
            homePage.pageType = 'HOMEPAGE';
            pages = pages.concat(templates);
        }

        pages = pages.map((page) =>
            page.type !== 'INDEX' ? { ...page, type: 'REGULAR' } : page
        );

        importJSON({ pages, global });
        setImport(true);
        closeModal();
    };

    const handleOnChange = (event) => {
        setKeep(event.target.value);
    };

    let msg = keep
        ? t('Your existing global styles & symbols will remain the same.')
        : t(
              'Your global styles and symbols will be replaced by the imported global styles and symbols.'
          );

    return (
        <Modal
            centered
            width={500}
            open={open}
            onOk={handleSubmit}
            onCancel={closeModal}
            okButtonProps={{
                size: 'small',
            }}
            cancelButtonProps={{
                size: 'small',
            }}
        >
            <Form style={{ maxWidth: 450 }}>
                <Form.Item>
                    <Typography.Title level={4}>
                        {t('Keep the current pages or remove them')}
                    </Typography.Title>
                    <Radio.Group onChange={handleOnChange} value={keep}>
                        <Space direction="vertical">
                            <Radio value={true}>
                                {t('Keep existing pages')}
                            </Radio>
                            <Radio value={false}>
                                {t('Remove existing pages')}
                            </Radio>
                        </Space>
                    </Radio.Group>
                    <AntAlert
                        description={
                            <>
                                <b>{t('Note')}: </b> {t(msg)}
                            </>
                        }
                        type="warning"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};
