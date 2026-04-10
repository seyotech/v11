import { Empty, Spin, message } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

import { BuilderContext } from '@/contexts/BuilderContext';
import { EditorContext } from '@/contexts/ElementRenderContext';
import { pageCompose } from '@/util/compose';
import { getExpandedKeys } from 'modules/Navigation/utils/navigation';
import {
    Icon,
    SwitcherIcon,
    Tree,
    TreeTitle,
} from 'modules/Shared/Tree/components';
import { filterTreeData } from 'modules/Shared/Tree/utils/tree';
import { useTranslation } from 'react-i18next';
import {
    buildPageTreeNodes,
    getNestedPages,
    getPageDropInfo,
    getParentAddressList,
    getSelectKey,
} from '../utils/page';

const PageTree = ({ search, handleSelectPage }) => {
    const context = useContext(EditorContext);
    const {
        appName,
        isSaving,
        isFetchingPage,
        save: savePages,
    } = useContext(BuilderContext);

    const [pages, setPages] = useState([]);
    const [pageTreeExpandedKeys, setPageTreeExpandedKeys] = useState([]);
    const [nodeKeyOnDropDown, setNodeKeyOnDropDown] = useState('');

    const { t } = useTranslation('builder');
    const handleContextMenu = () => {};
    const handleNodeKeyOnDropDown = (key) => {
        setNodeKeyOnDropDown((prev) => {
            if (key === prev) {
                return '';
            }
            return key;
        });
    };

    const generatePageTreeData = (pages) => {
        return pages.map((page) => {
            const _elType =
                {
                    '/': 'HOME',
                    index: 'HOME',
                }[page.slug] || 'PAGE';
            const currentPageData = {
                ...context.pages[page.pageIndex],
                pageIndex: page.pageIndex,
            };
            const isEditPage = context.editPageIndex === page.pageIndex;
            const isDraftCmsPage =
                appName === 'CMS' && currentPageData.status !== 'PUBLISHED';
            const hasChildPages = !!page.children.length;
            const isHomePage = currentPageData.pageType === 'HOMEPAGE';
            const isPublished = currentPageData.status === 'PUBLISHED';
            const isDropDownActive = nodeKeyOnDropDown === page.key;

            const treeNode = {
                ...page,
                style: { pointerEvents: 'auto' },
                icon: page.children?.length ? (
                    () => null
                ) : (
                    <Icon item={{ _elType }} />
                ),
                title: (
                    <TreeTitle
                        handleContextMenu={handleContextMenu}
                        handleNodeKeyOnDropDown={handleNodeKeyOnDropDown}
                        item={{
                            title: page.title,
                            address: page.key,
                            isDropDownActive,
                            options: {
                                isEditPage,
                                isDraftCmsPage,
                                currentPageData,
                                hasChildPages,
                                isHomePage,
                                isPublished,
                                appName,
                            },
                        }}
                        type="pageTree"
                    />
                ),
                ...(isDropDownActive &&
                    !isEditPage && {
                        className: 'activeDropDown',
                    }),
            };

            if (page.children) {
                treeNode.children = generatePageTreeData(page.children);
            }

            return treeNode;
        });
    };

    const treeData = generatePageTreeData(pages);

    const selectedKey = getSelectKey(context, treeData);

    const handleOnDrop = ({ dragNode, node, dropToGap, dropPosition }) => {
        const { slug: dragSlug, children = [], id, pageType } = dragNode;

        const { parentSlug, warning } = getPageDropInfo({
            node,
            dragNode,
            dropToGap,
            dropPosition,
        });

        if (warning)
            return message.open({
                type: 'warning',
                content: warning,
            });

        const nestedPages = getNestedPages({
            parentSlug,
            pages: children,
            replacer: `${dragSlug}/`,
        });
        const updatedPages = [
            { id, slug: parentSlug, pageType },
            ...nestedPages,
        ];

        savePages(
            { pages: updatedPages },
            { isNotify: true, redirectPageId: dragNode.id }
        );
    };

    const handleNodeDraggable = ({ slug, id }) =>
        slug && id && !search && !['/', 'index'].includes(slug);

    const onExpand = (expandedKeys, { expanded, node, nativeEvent: event }) => {
        if (event.clientX > 310) {
            return;
        }
        if (expanded) setPageTreeExpandedKeys([...expandedKeys]);
        else {
            setPageTreeExpandedKeys(
                pageTreeExpandedKeys.filter(
                    (item) => !item.startsWith(node.key)
                )
            );
        }
    };

    useEffect(() => {
        let pageTree = buildPageTreeNodes(
            pageCompose(context.pages, 'REGULAR')
        );

        if (search) {
            pageTree = filterTreeData({ treeData: pageTree, search });
            setPageTreeExpandedKeys(
                getExpandedKeys({ treeData: pageTree, searchTerm: search })
            );
        }
        setPages(pageTree);
    }, [context.pages, search]);

    useEffect(() => {
        if (selectedKey) {
            setPageTreeExpandedKeys([
                ...pageTreeExpandedKeys,
                ...getParentAddressList(selectedKey, pageTreeExpandedKeys),
            ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedKey]);

    if (!treeData.length)
        return <Empty description={<span>{t('No Page Available')}</span>} />;

    return (
        <SimpleBar
            style={{
                maxHeight: 570,
                padding: '0 12px',
                margin: '0 -12px',
            }}
        >
            <Spin size="small" spinning={isSaving || isFetchingPage}>
                <Tree
                    showIcon
                    blockNode
                    autoExpandParent
                    treeData={treeData}
                    onExpand={onExpand}
                    onDrop={handleOnDrop}
                    switcherIcon={SwitcherIcon}
                    selectedKeys={[selectedKey]}
                    defaultExpandedKeys={[selectedKey]}
                    expandedKeys={pageTreeExpandedKeys}
                    onSelect={handleSelectPage}
                    draggable={{
                        icon: false,
                        nodeDraggable: handleNodeDraggable,
                    }}
                    data-testid="regular-page-tree"
                />
            </Spin>
        </SimpleBar>
    );
};

export default PageTree;
