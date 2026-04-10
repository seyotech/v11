import { getType, handleCanDrop } from '@/util/dndHelpers';
import { t } from 'i18next';

export const getTreeNode = ({ item, symbols, key, data: parent }) => {
    const { symbolId } = item;
    const dataRef = {
        ...(symbolId ? symbols[symbolId].data : item),
    };

    const className = symbolId ? 'global-symbol' : '';
    let title = dataRef.name;

    if (symbolId) {
        title += ` ( ${symbols[symbolId].name || t('unknown')} )`;
    }

    dataRef.parentType = parent.type;

    const treeNode = {
        key,
        title,
        parent,
        dataRef,
        className,
    };
    return treeNode;
};

export const getNavTreeData = ({ data = {}, symbols, parentAddress = 0 }) => {
    if (Array.isArray(data.content)) {
        return data.content

            .map((item, index) => {
                // filter symbol element if symbol is missing in global symbols or element is null
                if (!(item?.symbolId ? symbols[item.symbolId] : item)) return;
                const key = `${parentAddress}-${index}`;
                const treeNode = getTreeNode({
                    key,
                    item,
                    data,
                    symbols,
                });
                const { dataRef } = treeNode;

                if (Array.isArray(dataRef.content)) {
                    const children = getNavTreeData({
                        symbols,
                        data: dataRef,
                        parentAddress: key,
                    });

                    return { ...treeNode, children };
                }

                if (treeNode.title) return treeNode;
            })
            .filter(Boolean);
    }
    return [];
};

export const handleAllowNavTreeDrop = ({
    dragNode,
    dropNode,
    getDataByAddress,
}) => {
    const source = nodeToElementConverter(dragNode);
    const destination = nodeToElementConverter(dropNode);
    const canDrop = handleCanDrop(source, destination, getDataByAddress);

    const canDropAsChildren = isDropAllowedToParent({
        childType: source.type,
        parentType: destination.type,
    });

    const nextAddress = source.address.replace(
        /\d$/gi,
        (n) => `${Number(n) + 1}`
    );

    const isNextAddress = nextAddress === destination.address;

    return canDrop || canDropAsChildren || isNextAddress;
};

export const nodeToElementConverter = (node) => {
    const address = node.key.split('-').slice(1).join('.');

    const parentType = node.parent.type ? getType(node.parent.type) : undefined;

    const element = {
        ...node.dataRef,
        address,
        parentType,
        type: getType(node.dataRef.type),
    };

    const itemsFields = ['cms_column', 'isNestedCmsRow', 'component_label'];

    while (itemsFields.length) {
        const field = itemsFields.shift();
        const value = node.dataRef[field];
        if (value) {
            if (!element.item) element.item = {};
            element.item[field] = value;
        }
    }

    return element;
};

export const isDropAllowedToParent = ({ parentType, childType }) => {
    return (
        {
            row: ['column'],
            column: ['component'],
            section: ['row', 'container'],
            container: ['container', 'component'],
        }[parentType] || []
    ).includes(childType);
};

export const formatNavTreeDragAndDropData = (props) => {
    const source = nodeToElementConverter(props.dragNode);
    const destination = nodeToElementConverter(props.node);

    const droppableAsChildren = isDropAllowedToParent({
        childType: source.type,
        parentType: destination.type,
    });
    const droppableAsSibling = isDropAllowedToParent({
        childType: source.type,
        parentType: destination.parentType,
    });

    if (droppableAsChildren && (!props.dropToGap || !droppableAsSibling)) {
        destination.address = `${destination.address}.0`;
    } else if (-1 !== props.dropPosition) {
        destination.address = destination.address.replace(
            /\d$/gi,
            (m) => `${Number(m) + 1}`
        );
    }

    return {
        source,
        destination,
    };
};

export const filterTreeData = ({ treeData, search = '' }) => {
    if (!search) return treeData;

    return treeData
        .map((node) => {
            if (node.children?.length) {
                const childNodes = filterTreeData({
                    search,
                    treeData: node.children,
                });

                if (childNodes.length) {
                    const parentNode = {
                        ...node,
                        children: childNodes,
                    };
                    return parentNode;
                }
            }

            const isSearchIncludeInTitle = node.title
                .toLocaleLowerCase()
                .includes(search.toLocaleLowerCase());

            if (isSearchIncludeInTitle) return node;
        })
        .filter(Boolean);
};
