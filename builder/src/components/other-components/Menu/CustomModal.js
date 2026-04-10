import { Alert, Form, Modal, Radio, Space } from 'antd';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import styled from 'styled-components';

import useImport from '../../../hooks/useImport';
import { maxPageNumber } from '../../../util/maxPageNumber';

const AntAlert = styled(Alert)`
    &.ant-alert-with-description.ant-alert-no-icon {
        margin-top: 10px;
        padding: 10px;
    }
`;

const handleDuplicatePage = (page, pages, oldPages) => {
    const uuid = nanoid(6);

    page.slug = `${page.slug}-${uuid}`;
    page.name = `${page.name} ${maxPageNumber({
        pages,
        oldPages,
        name: page.name,
    })}`;
};

const handleDuplicateHome = (page, pages, oldPages) => {
    page.slug = `index-${nanoid(6)}`;
    page.type = null;
    page.pageType = 'REGULAR';
    page.name = `Home Old ${maxPageNumber({
        pages,
        oldPages,
    })}`;
};

const CustomModal = ({ importJSON, visible, closeModal }) => {
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
        ? 'Your existing global styles & symbols will remain the same.'
        : 'Your global styles and symbols will be replaced by the imported global styles and symbols.';

    return (
        <div onClick={(event) => event.stopPropagation()}>
            <Modal
                centered
                width={500}
                visible={visible}
                onOk={handleSubmit}
                onCancel={closeModal}
            >
                <div className="container">
                    <Form style={{ maxWidth: 450 }}>
                        <Form.Item>
                            <h4>Do you want to keep existing pages ?</h4>
                            <Radio.Group onChange={handleOnChange} value={keep}>
                                <Space direction="vertical">
                                    <Radio value={true}>
                                        Keep existing pages
                                    </Radio>
                                    <Radio value={false}>
                                        Delete existing pages
                                    </Radio>
                                </Space>
                            </Radio.Group>
                            <AntAlert
                                description={
                                    <>
                                        <b>Note: </b> {msg}
                                    </>
                                }
                                type="warning"
                            />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
    );
};

export default CustomModal;
