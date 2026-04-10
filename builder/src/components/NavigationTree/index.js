import { Tree } from 'antd';

import React, { useContext, useEffect } from 'react';
import { ElementContext } from '../../contexts/ElementRenderContext';
import modalLibrary from '../../components/editor-resources/elements';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AntdTree } from './AntdTree';
import { NAVIGATION_TREE } from '../../constants/index';

const { ELEMENT } = modalLibrary;

let elements = ELEMENT[0].body.flatMap((item) => item.elements);

const { TreeNode } = Tree;

const RenderElIcon = ({ component_path, type }) => {
    let { icon = [] } =
        elements.find((el) => {
            return el.data.component_path === component_path;
        }) || {};

    return <FontAwesomeIcon icon={icon} style={{ color: '#EA580C' }} />;
};

const RenderIcon = ({ item }) => {
    let Icon = {
        SECTION: (
            <FontAwesomeIcon
                icon={['far', 'layer-group']}
                style={{ color: '#18181B' }}
            />
        ),
        ROW: (
            <FontAwesomeIcon
                icon={['fad', 'grip-horizontal']}
                style={{ color: '#4d05e8' }}
            />
        ),
        CMSROW: (
            <FontAwesomeIcon
                icon={['fad', 'grip-horizontal']}
                style={{ color: '#0062ff' }}
            />
        ),
        COLUMN: (
            <FontAwesomeIcon
                icon={['far', 'columns']}
                style={{ color: '#FA1CA8' }}
            />
        ),
        ELEMENT: <RenderElIcon {...item} />,
    }[item._elType];

    if (!Icon) return null;

    return Icon;
};

const getAddress = (addr) => {
    let address = addr.split('-').slice(1);

    return {
        address: address?.join('.'),
        length: address?.length,
    };
};

export default function NavigationTree({
    editAddress,
    navTreeExpandedKeys,
    setNavTreeExpandKeys,
}) {
    const {
        currentPageInfo,
        symbols = {},
        showSettingsModal,
        onDragItem,
        onElementRightClick,
    } = useContext(ElementContext);

    const renderTitle = (item) => {
        return (
            <div className="title-wrapper">
                <span className="title" title={item.name}>
                    {item.name}
                </span>
                <button
                    className="action-btn"
                    onClick={(event) => {
                        event.stopPropagation();
                        handleContextMenu({
                            event,
                            node: {
                                pos: item.address,
                            },
                        });
                    }}
                >
                    <FontAwesomeIcon icon={['fas', 'ellipsis-vertical']} />
                </button>
            </div>
        );
    };
    const renderTreeNodes = (data = {}, parentAddress = 0) => {
        if (Array.isArray(data.content)) {
            return data.content
                .filter((item) => {
                    if (!item) return false;
                    if (item.symbolId && !symbols[item.symbolId]) return false;
                    return true;
                })
                .map((item, index) => {
                    let additionalInfo = {};
                    if (item.symbolId) {
                        const { data = {}, name } = symbols[item.symbolId];
                        item = data;
                        additionalInfo.symbol = true;
                        additionalInfo.name = `${data.name} ( ${
                            name || 'unknown'
                        } )`;
                    } else {
                        additionalInfo.name = item.name;
                    }
                    additionalInfo.address = `${parentAddress}-${index}`;
                    const className = additionalInfo.symbol
                        ? 'global-symbol'
                        : '';
                    if (Array.isArray(item.content)) {
                        return (
                            <TreeNode
                                icon={<RenderIcon item={item} />}
                                title={renderTitle(additionalInfo)}
                                key={additionalInfo.address}
                                dataRef={item}
                                parent={data}
                                className={className}
                            >
                                {renderTreeNodes(item, additionalInfo.address)}
                            </TreeNode>
                        );
                    }

                    return (
                        <TreeNode
                            icon={<RenderIcon item={item} />}
                            title={renderTitle(additionalInfo)}
                            dataRef={item}
                            key={additionalInfo.address}
                            parent={data}
                            className={className}
                        >
                            {item.name}
                        </TreeNode>
                    );
                });
        }
    };

    const onSelect = (key, info) => {
        const { address } = getAddress(info.node.pos);
        showSettingsModal('COMPONENT_SETTINGS', address, NAVIGATION_TREE);
    };
    const getNumeric = (add) => Number(add.split('.').join(''));
    const handleOnDrop = (props) => {
        const dragDataRef = props.dragNode.dataRef;
        const dropDataRef = props.node.dataRef;

        let { address: sourceAddr, length: sourceAddLength } = getAddress(
            props.dragNode.pos
        );
        let { address: destinationAddr, length: desAddrLength } = getAddress(
            props.node.pos
        );

        let source = {};
        let destination = {};

        // allow if drag and drop el length is equal
        let canDrop = desAddrLength === sourceAddLength;

        // prevent droping into nestedRow
        if (sourceAddLength > 4) {
            return;
        }

        // allow droping or replceing regular element with nested row
        if (
            props.dragNode.component_label === 'nestedRow' &&
            props.dropNode?._elType === 'ELEMENT'
        ) {
            return true;
        }

        // is drop element as first child in it's parent element
        const isDropAsFirstChild =
            !dragDataRef.component_label &&
            componentParrentType[dragDataRef._elType] === dropDataRef._elType;

        // is nested row drop into regular column
        const isDropN_RowInR_Column =
            dropDataRef._elType === 'COLUMN' &&
            dragDataRef.component_label === 'nestedRow';

        if (canDrop) {
            // get drag direction
            const diff = getNumeric(destinationAddr) - getNumeric(sourceAddr);
            const isMovingTop = diff < 0;

            if (isMovingTop && props.node.dragOverGapBottom) {
                if (diff + 1 === 0) return;
                const [...pos] = props.node.pos.split('-');
                pos[pos.length - 1] = Number(pos[pos.length - 1]) + 1;
                const { address } = getAddress(pos.join('-'));
                destinationAddr = address;
            }
            source.address = sourceAddr;
            destination.address = destinationAddr;
            onDragItem({ source, destination });
        } else {
            if (isDropAsFirstChild || isDropN_RowInR_Column) {
                source.address = sourceAddr;
                destination.address = destinationAddr + '.0';
                onDragItem({
                    source,
                    destination,
                });
            }
        }
    };

    const componentParrentType = {
        ELEMENT: 'COLUMN',
        COLUMN: 'ROW',
        ROW: 'SECTION',
        CMSROW: 'SECTION',
    };

    const handleAllowDrops = ({ dragNode, dropNode }) => {
        const dragData = dragNode.dataRef;
        const dropData = dropNode.dataRef;
        const dragDataRef = dragData._elType;
        const dropDataRef = dropData._elType;

        if (dropData.component_label === 'nestedCol' || dropData.cms_column) {
            return false;
        }

        // nested row can drop only its parent col
        if (
            dropData._elType === 'COLUMN' &&
            dragData.component_label === 'nestedRow'
        ) {
            return true;
        }

        // is regular element replace with nestedRow
        let elementWithNestedRow =
            dragData._elType === 'ELEMENT' &&
            dropData.component_label === 'nestedRow';

        // is nestedRow replace with regular element
        let nestedRowWithElement =
            dragData.component_label === 'nestedRow' &&
            dropData?._elType === 'ELEMENT';

        // is drag and drop element type is equal
        let isRefEqual =
            dragDataRef === dropDataRef &&
            dragData.component_label === dropData.component_label;

        // regular row can replace with cms row
        const isRow =
            (dragDataRef === 'ROW' && dropDataRef === 'CMSROW') ||
            (dragDataRef === 'CMSROW' && dropDataRef === 'ROW');

        // general component
        let isDroppedOnPermittedArea =
            !dragData.component_label &&
            componentParrentType[dragData._elType] === dropData._elType;

        return (
            elementWithNestedRow ||
            nestedRowWithElement ||
            isRefEqual ||
            isRow ||
            isDroppedOnPermittedArea
        );
    };

    const handleContextMenu = ({ event, node }) => {
        const { clientX, clientY } = event;
        const { address } = getAddress(node.pos);

        onElementRightClick({
            triggerFrom: NAVIGATION_TREE,
            contextMenuPosition: {
                clientX: clientX - 60,
                clientY: clientY - 60,
            },
            address,
        });
    };

    const handleDrag = ({ dataRef, parent }) => {
        // prevent draging into nested row
        if (
            dataRef.cms_column ||
            dataRef.component_label === 'nestedCol' ||
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

    let selectedElementKey = '0-' + editAddress?.split('.').join('-');

    useEffect(() => {
        if (selectedElementKey) {
            setNavTreeExpandKeys([
                ...navTreeExpandedKeys,
                ...getParentAddressList(selectedElementKey),
            ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editAddress]);

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
    return (
        <AntdTree
            showLine
            showIcon
            onSelect={onSelect}
            onDrop={handleOnDrop}
            selectedKeys={[selectedElementKey]}
            allowDrop={handleAllowDrops}
            className="antd-custom-tree"
            onRightClick={handleContextMenu}
            defaultExpandedKeys={[selectedElementKey]}
            expandedKeys={navTreeExpandedKeys}
            draggable={(props) => handleDrag(props)}
            // autoExpandParent={true}
            onExpand={onExpand}
        >
            {renderTreeNodes(currentPageInfo.data, 0)}
        </AntdTree>
    );
}
