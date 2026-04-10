import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Space, Typography } from 'antd';
import debounce from 'lodash.debounce';
import { nanoid } from 'nanoid';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { EditorContext, ElementContext } from '@/contexts/ElementRenderContext';
import { BuilderContext } from 'contexts/BuilderContext';
import AntCollapse from 'modules/Shared/AntCollapse';
import DrawerHeader from 'modules/Shared/DrawerHeader';
import { pageCompose } from '@/util/compose';
import { useAI } from '../../AI/hooks/useAI';
import PageTree from './PageTree';
import PagesList from './PagesList';

const Label = styled.div`
    display: flex;
    margin-left: -4px;
    align-items: center;
    justify-content: space-between;
`;

const getItems = ({
    panelStyle,
    search,
    t,
    handleCreatePageByAI,
    handleAddRegularPage,
    handleSelectPage,
    isAIGenerated,
}) => [
    {
        style: panelStyle,
        appNames: ['CMS', 'STATIC'],
        key: 'regular-pages',
        children: (
            <PageTree search={search} handleSelectPage={handleSelectPage} />
        ),
        label: (
            <Label>
                <Typography.Text strong>{t('Regular Pages')}</Typography.Text>
                <Space>
                    {isAIGenerated && (
                        <Button
                            data-testid="add-ai-page"
                            type="primary"
                            ghost
                            size="small"
                            title={t('Create new page with AI')}
                            icon={
                                <FontAwesomeIcon
                                    icon={icon({
                                        name: 'sparkles',
                                        style: 'solid',
                                    })}
                                />
                            }
                            onClick={handleCreatePageByAI}
                        />
                    )}
                    <Button
                        data-testid="addRegularPage"
                        type="text"
                        size="small"
                        title={t('Create New Page')}
                        icon={
                            <FontAwesomeIcon
                                icon={icon({ name: 'plus', style: 'solid' })}
                            />
                        }
                        onClick={handleAddRegularPage}
                    />
                </Space>
            </Label>
        ),
    },
    {
        style: panelStyle,
        key: 'template-pages',
        appNames: ['CMS'],
        children: (
            <PagesList
                search={search}
                pageType="TEMPLATE"
                handleSelectPage={handleSelectPage}
            />
        ),
        label: (
            <Label>
                <Typography.Text strong>{t('Template Pages')}</Typography.Text>
            </Label>
        ),
    },
    {
        style: panelStyle,
        key: 'system-pages',
        appNames: ['CMS'],
        children: (
            <PagesList
                search={search}
                pageType="UTIL"
                handleSelectPage={handleSelectPage}
            />
        ),
        label: (
            <Label>
                <Typography.Text strong>{t('Utility Pages')}</Typography.Text>
            </Label>
        ),
    },
];

const Pages = () => {
    const [search, setSearch] = useState('');
    const { appName, save, isAIGenerated, selectPage, ...rest } =
        useContext(BuilderContext);
    const { pages, editPageIndex } = useContext(EditorContext);
    const { setSettingsModal } = useAI();
    const { onSelectPage } = useContext(ElementContext);
    const { t } = useTranslation('builder');
    const currentEditPageType = pages[editPageIndex]?.pageType || 'REGULAR';
    const isCMSBuilder = appName === 'CMS';
    const handleAddRegularPage = (event) => {
        event.stopPropagation();
        const newPage = {
            name: 'Untitled',
            slug: nanoid(6),
            pageType: 'REGULAR',
            data: JSON.stringify({ content: [] }),
            ...(isCMSBuilder && {
                isPasswordEnable: false,
                status: 'PUBLISHED',
            }),
        };
        save({ pages: [newPage] }, { isNotify: true, isPageSave: true });
    };

    const handleCreatePageByAI = () => {
        setSettingsModal('AI_SUB_PAGE_MODAL');
    };

    const handleSelectPage = (_, { node, nativeEvent: event }) => {
        if (event && event.clientX > 310) {
            event.stopPropagation();
            return;
        }
        const page = pages[node.pageIndex];
        if (page.id) {
            selectPage(page);
        }
        onSelectPage(node.pageIndex);
    };

    const panelStyle = {
        borderRadius: 0,
    };

    const handleDebounce = debounce((e) => setSearch(e.target.value), 700);

    const activeKey = {
        HOMEPAGE: 'regular-pages',
        REGULAR: 'regular-pages',
        TEMPLATE: 'template-pages',
        UTIL: 'system-pages',
    }[currentEditPageType];

    return (
        <>
            <DrawerHeader title={t('Pages')} onChange={handleDebounce} />
            <AntCollapse
                defaultActiveKey={[activeKey]}
                items={getItems({
                    t,
                    search,
                    isAIGenerated,
                    handleAddRegularPage,
                    handleCreatePageByAI,
                    handleSelectPage,
                }).filter((item) => item.appNames.includes(appName))}
            />
        </>
    );
};

export default Pages;
