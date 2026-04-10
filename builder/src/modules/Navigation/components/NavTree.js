import { Empty } from 'antd';
import { useContext, useEffect, useState } from 'react';

import { NAVIGATION_TREE } from '@/constants/index';
import { ElementContext } from '@/contexts/ElementRenderContext';
import {
    filterTreeData,
    formatNavTreeDragAndDropData,
    getNavTreeData,
    handleAllowNavTreeDrop,
} from '@/modules/Shared/Tree/utils/tree';
import {
    Icon,
    SwitcherIcon,
    Tree,
    TreeTitle,
} from 'modules/Shared/Tree/components';
import { useTranslation } from 'react-i18next';
import { getExpandedKeys } from '../utils/navigation';

const getAddress = (addr) => {
    let address = addr.split('-').slice(1);

    return {
        address: address?.join('.'),
        length: address?.length,
    };
};

export default function NavTree({ search }) {
    const {
        onDragItem,
        symbols = {},
        currentPageInfo,
        showSettingsModal,
        currentEditAddress,
        getDataByAddress,
        onElementRightClick,
    } = useContext(ElementContext);
    const editAddress = currentEditAddress();
    const { t } = useTranslation('builder');

    const [treeData, setTreeData] = useState([]);
    const [navTreeExpandedKeys, setNavTreeExpandKeys] = useState([]);

    const onSelect = (key, info) => {
        const { address } = getAddress(info.node.key);
        showSettingsModal('COMPONENT_SETTINGS', address, NAVIGATION_TREE);
    };

    const handleOnDrop = (props) => {
        const { source, destination } = formatNavTreeDragAndDropData(props);

        onDragItem({
            source,
            destination,
        });
    };

    const handleContextMenu = ({ event, node }) => {
        const { clientX, clientY } = event;
        const { address } = getAddress(node.key);

        onElementRightClick({
            triggerFrom: NAVIGATION_TREE,
            contextMenuPosition: {
                clientX: clientX - 60,
                clientY: clientY - 60,
            },
            address,
        });
    };

    const nodeDraggable = ({ dataRef, parent }) => {
        if (
            search ||
            dataRef.cms_column ||
            dataRef.component_label === 'nestedCol' ||
            dataRef.component_label === 'nestedRow' ||
            parent.component_label === 'nestedCol' ||
            parent.cms_column
        ) {
            return false;
        }

        return true;
    };

    const onExpand = (expandedKeys, { expanded, node }) => {
        if (expanded) setNavTreeExpandKeys([...expandedKeys]);
        else {
            setNavTreeExpandKeys(
                navTreeExpandedKeys.filter((item) => !item.startsWith(node.key))
            );
        }
    };

    function generateTreeNode(treeData) {
        return treeData.map((node) => {
            const newNode = {
                ...node,
                icon: <Icon item={node.dataRef} />,
                title: (
                    <TreeTitle
                        handleContextMenu={handleContextMenu}
                        item={{
                            title: node.title,
                            address: node.key,
                            options: {},
                        }}
                        type="navTree"
                    />
                ),
            };
            if (node.children) {
                const children = generateTreeNode(node.children);
                return {
                    ...newNode,
                    children,
                };
            }

            return newNode;
        });
    }

    const navTreeData = generateTreeNode(treeData);

    let selectedElementKey = '0-' + editAddress?.split('.').join('-');

    const getParentAddressList = (selectedElementKey) => {
        return selectedElementKey
            .split('-')
            .reduce((acc, item, index) => {
                index == 0
                    ? acc.push(item)
                    : acc.push(acc[index - 1] + '-' + item);
                return acc;
            }, [])
            .filter((item) => !navTreeExpandedKeys.includes(item));
    };

    useEffect(() => {
        if (selectedElementKey) {
            setNavTreeExpandKeys([
                ...navTreeExpandedKeys,
                ...getParentAddressList(selectedElementKey),
            ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editAddress]);

    useEffect(() => {
        let treeData = getNavTreeData({
            symbols,
            data: currentPageInfo.data,
        });

        if (search) {
            treeData = filterTreeData({ treeData, search });
            setNavTreeExpandKeys(
                getExpandedKeys({ treeData, searchTerm: search })
            );
        }
        setTreeData(treeData);
    }, [symbols, currentPageInfo.data, search]);

    if (!navTreeData.length)
        return <Empty description={<span>{t('No data available')}</span>} />;

    return (
        <Tree
            showIcon
            onSelect={onSelect}
            onExpand={onExpand}
            onDrop={handleOnDrop}
            treeData={navTreeData}
            autoExpandParent={true}
            switcherIcon={SwitcherIcon}
            style={{ padding: '0 12px' }}
            onRightClick={handleContextMenu}
            expandedKeys={navTreeExpandedKeys}
            allowDrop={({ dragNode, dropNode }) =>
                handleAllowNavTreeDrop({ dragNode, dropNode, getDataByAddress })
            }
            selectedKeys={[selectedElementKey]}
            defaultExpandedKeys={[selectedElementKey]}
            draggable={{
                icon: false,
                nodeDraggable,
            }}
        />
    );
}
