import { Typography } from 'antd';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';

import { EditorContext } from '@/contexts/ElementRenderContext';
import { pageCompose } from '@/util/compose';
import { Icon, Tree } from 'modules/Shared/Tree/components';
import { buildPageTreeNodes, getSelectKey } from '../utils/page';

const PagesList = ({ search, pageType, handleSelectPage }) => {
    const context = useContext(EditorContext);
    const [pages, setPages] = useState([]);

    const mapPagesRecursive = (pages, parentKey = '0') => {
        return pages.map((page, index) => {
            const key = `${parentKey}-${index}`;

            const treeNode = {
                ...page,
                key,
                icon: page.children?.length ? (
                    () => null
                ) : (
                    <Icon item={{ _elType: 'PAGE' }} />
                ),
                title: (
                    <Typography.Text
                        className="title"
                        title={page.title}
                        data-testid={`node-${key}`}
                    >
                        {page.title}
                    </Typography.Text>
                ),
            };

            if (page.children) {
                treeNode.children = mapPagesRecursive(page.children, key);
            }

            return treeNode;
        });
    };

    const treeData = mapPagesRecursive(buildPageTreeNodes(pages));
    const selectedKey = getSelectKey(context, treeData);

    useEffect(() => {
        setPages(pageCompose(context.pages, pageType, search));
    }, [context.pages, pageType, search]);

    return (
        <Tree
            showIcon
            blockNode
            treeData={treeData}
            draggable={false}
            onSelect={handleSelectPage}
            selectedKeys={[selectedKey]}
            data-testid={`${pageType}-page-tree`}
        />
    );
};

PagesList.propTypes = {
    search: PropTypes.string,
    pageType: PropTypes.string.isRequired,
};

export default PagesList;
