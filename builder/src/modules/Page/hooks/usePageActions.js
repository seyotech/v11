import { App } from 'antd';
import { nanoid } from 'nanoid';
import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    EditorContext,
    ElementContext,
} from '../../../contexts/ElementRenderContext';
import { BuilderContext } from '../../../contexts/BuilderContext';

function usePageActions({ item }) {
    const { t } = useTranslation('builder');
    const { modal: antModal } = App.useApp();
    const { showSettingsModal, selectHomePage, setPages } =
        useContext(ElementContext);
    const { editPageIndex } = useContext(EditorContext);
    const { isSaving, save, appName, removePage, selectPage, getPageDataById } =
        useContext(BuilderContext);

    const [modal, setModal] = useState({});
    const onCancel = () => {
        setModal((prev) => ({ ...prev, open: false, modalSite: null }));
    };

    const isLoadingRef = useRef(true);
    const [isDeleting, setIsdeleting] = useState(false);
    useEffect(() => {
        if (isLoadingRef.current && (!isSaving || !isDeleting)) {
            isLoadingRef.current = false;
        } else {
            isLoadingRef.current = true;
        }
    }, [isSaving, isDeleting]);

    const handlePageSettings = (e) => {
        // setBuilderFocus(true);
        showSettingsModal('PAGE-SETTINGS');
    };

    const handleHomepage = ({ page }) => {
        const { pageIndex } = page;
        antModal.confirm({
            content: t('Are you sure to switch Home page?'),
            okText: t('Yes'),
            cancelText: t('No'),
            onOk: async () => {
                const nextPages = await selectHomePage(page);
                let preventInterval;
                return new Promise((resolve) => {
                    const interval = setInterval(() => {
                        if (!preventInterval) {
                            resolve(true);
                            clearInterval(interval);
                            preventInterval = true;
                            setPages({
                                pages: nextPages,
                                activePageIndex: pageIndex,
                            });
                            selectPage(page);
                        }
                    }, 500);
                });
            },
        });
    };

    const handleAddPage = ({ page }) => {
        const newPage = {
            name: t('Untitled'),
            slug: `${page.slug}/${nanoid(6)}`,
            pageType: 'REGULAR',
            data: JSON.stringify({ content: [] }),
            ...(appName === 'CMS' && {
                isPasswordEnable: false,
                status: 'PUBLISHED',
            }),
        };
        save({ pages: [newPage] }, { isNotify: true, isPageSave: true });
    };

    const handleChangeNameAndSlug = ({ page }) => {
        setModal(() => ({
            onCancel,
            open: true,
            footer: false,
            type: 'changeNameAndSlug',
            okText: t('Save'),
            cancelText: t('Cancel'),
            title: t('Page name and slug'),
            page,
        }));
    };

    const handleDuplicate = async ({ page }) => {
        let targetPageData = await getPageDataById(page.id);
        if (!targetPageData) return;
        const copyPage = {
            ...page,
            name: `${page.name} Copy`,
            slug: `${page.slug}-${nanoid(6)}`,
            pageType: page.pageType === 'HOMEPAGE' ? 'REGULAR' : page.pageType,
            data: targetPageData || undefined,
        };
        delete copyPage.id;
        delete copyPage.linkId;
        delete copyPage.pageIndex;
        delete copyPage.isModified;
        save({ pages: [copyPage] }, { isNotify: true, isPageSave: true });
    };

    const handlePublishStatus = ({ page, changedStatus }) => {
        antModal.confirm({
            content: `Are you sure to switch page status to ${changedStatus}?`,
            okText: 'Yes',
            cancelText: 'No',
            onOk() {
                const isModified = page.isModified;
                const updatedPage = {
                    ...page,
                    data:
                        isModified && page.data
                            ? JSON.stringify(page.data)
                            : undefined,
                    status: changedStatus,
                };
                delete updatedPage.type;
                delete updatedPage.isModified;
                delete updatedPage.pageIndex;
                save(
                    { pages: [updatedPage] },
                    { isNotify: true, isPageSave: true }
                );
            },
        });
    };

    const handleDeletePage = ({ page }) => {
        if (page.id) {
            antModal.confirm({
                content: t('Are you sure you want to remove this page?'),
                okText: t('Yes'),
                cancelText: t('No'),
                onOk() {
                    removePage({
                        id: page.id,
                        index: page.pageIndex,
                        editPageIndex,
                        setIsdeleting,
                    });
                    return new Promise((resolve) => {
                        const interval = setInterval(() => {
                            if (!isLoadingRef.current) {
                                resolve(true);
                                clearInterval(interval);
                                isLoadingRef.current = true;
                            }
                        }, 500);
                    });
                },
            });
        }
    };

    const handlers = {
        pageSettings: handlePageSettings,
        setAsHomepage: handleHomepage,
        addPage: handleAddPage,
        pageNameSlug: handleChangeNameAndSlug,
        duplicate: handleDuplicate,
        publishStatus: handlePublishStatus,
        deletePage: handleDeletePage,
    };
    return {
        handlers,
        modal,
    };
}

export default usePageActions;
