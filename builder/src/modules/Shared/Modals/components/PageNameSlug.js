import { BuilderContext } from '@/contexts/BuilderContext';
import { ElementContext } from '@/contexts/ElementRenderContext';
import { Form, Input } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Footer } from './Footer';

const getParentAndChildSlugs = (pageSlug) => {
    const [, parentSlug, childSlug] = pageSlug.match(/^(.*\/)([^/]+)$/) || [];
    return { parentSlug, childSlug };
};

function PageNameSlug({ close, page }) {
    const { t } = useTranslation('builder');
    const { pages, setPages } = useContext(ElementContext);
    const { isSaved, isSaving, save } = useContext(BuilderContext);
    const [nextPages, setNextPages] = useState(null);
    const isSavingRef = useRef(null);
    const { useForm, useWatch } = Form;
    const [form] = useForm();
    const name = useWatch('name', form);
    const slug = useWatch('slug', form);
    const { parentSlug, childSlug } = getParentAndChildSlugs(page.slug);
    const isChildPage = parentSlug && childSlug;
    const initialValues = {
        name: page.name,
        slug: isChildPage ? childSlug : page.slug,
    };
    const newSlug = `${parentSlug || ''}${slug}`;
    const handleClose = (nextPages) => {
        setPages({
            pages: nextPages,
            activePageIndex: page.pageIndex,
        });
        form.resetFields();
        close();
    };

    useEffect(() => {
        if (isSaving) {
            isSavingRef.current = isSaving;
        }

        !isSaving &&
            isSavingRef.current &&
            isSaved &&
            pages.length === nextPages.length &&
            handleClose(nextPages);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSaving, isSaved, nextPages]);

    const updatePage = (index) => {
        const isSlugSame = newSlug === pages[page.pageIndex].slug;
        const currentPageData = { ...pages[index], name, slug: newSlug };
        const regexPattern = `^${pages[index].slug}(/.+)$`;
        const tempPages = [...pages];
        tempPages.splice(index, 1, currentPageData);

        const updatedPages = tempPages
            .reduce(
                (acc, page, idx) => {
                    if (isSlugSame) {
                        return acc;
                    }
                    if (page.slug.match(new RegExp(regexPattern, 'g'))) {
                        acc.push({ ...page, pageIndex: idx });
                    }
                    return acc;
                },
                [{ ...currentPageData, pageIndex: index }]
            )
            .map((modifiedPage) => {
                const isModified = modifiedPage.isModified;
                const isParent = modifiedPage.slug === newSlug;
                delete modifiedPage.type;
                delete modifiedPage.isModified;
                return {
                    ...modifiedPage,
                    ...(!isParent && {
                        slug: modifiedPage.slug.replace(
                            new RegExp(regexPattern, 'g'),
                            `${newSlug}$1`
                        ),
                    }),
                    data:
                        isModified && modifiedPage.data
                            ? JSON.stringify(modifiedPage.data)
                            : undefined,
                };
            });

        updatedPages.forEach((page) => {
            const pageIndex = page.pageIndex;
            delete page.pageIndex;
            tempPages.splice(pageIndex, 1, {
                ...tempPages[pageIndex],
                name: page.name,
                slug: page.slug,
            });
        });

        save({ pages: [...updatedPages] }, { isNotify: true });
        setNextPages(tempPages);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={() => {
                updatePage(page.pageIndex);
            }}
            colon={false}
            initialValues={initialValues}
        >
            <Form.Item
                name="name"
                label={t('Page Name')}
                style={{ marginTop: '16px', marginBottom: '20px' }}
                required
                rules={[
                    {
                        required: true,
                        whitespace: false,
                    },
                ]}
            >
                <Input type="text" placeholder={t('Enter Page Name')} />
            </Form.Item>
            <Form.Item
                name="slug"
                label={t('Page Slug')}
                style={{ marginTop: '16px', marginBottom: '20px' }}
                required
                rules={[
                    {
                        required: true,
                        whitespace: false,
                    },
                    {
                        pattern: /^\w+/g,
                        message: t('Must start with alphanumeric character'),
                    },
                    {
                        pattern: /\w+$/g,
                        message: t('Must end with alphanumeric character'),
                    },
                    {
                        pattern: /^[\w-]*$/gm,
                        message: t('Allowed special characters are', {
                            chars: ': - and _',
                        }),
                    },
                ]}
                extra={isChildPage ? newSlug : ''}
            >
                <Input type="text" placeholder={t('Enter Page Slug')} />
            </Form.Item>

            <Footer
                okButtonText={t('Save')}
                cancelButtonText={t('Cancel')}
                okButtonProps={{
                    loading: isSaving,
                    type: 'primary',
                }}
                cancelButtonProps={{
                    disabled: isSaving,
                    onClick: (e) => {
                        e.stopPropagation();
                        handleClose();
                    },
                }}
            />
        </Form>
    );
}

export default PageNameSlug;
