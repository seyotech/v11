import { DND_TYPES } from '../constants';
import { createContainer } from './container/container';
import {
    getElementAddress,
    getElementContext,
    updateEdgeContent,
} from './element';
import uuid from './uniqId';

const { ROW, CMS_ROW, COLUMN, CONTAINER, COMPONENT } = DND_TYPES;

const getNumericAddress = (address) => Number(address.split('.').join(''));

const acceptedTypes = Object.values(DND_TYPES);

export const getType = (type) => {
    if (!acceptedTypes.includes(type)) return COMPONENT;
    return type;
};

export const getDnDConfig = (type) => ({
    accept: acceptedTypes,
    type: getType(type),
});

export function handleDrop(props, sourceItem) {
    try {
        const source = {
            index: sourceItem.index,
            address: sourceItem.address,
            parent: sourceItem.parentAddress,
            type: sourceItem.type,
        };

        const destinationParentType =
            props.isEmpty && props.type === 'container'
                ? props.type
                : props.parentType;

        const destination = {
            index: props.index,
            address: props.address,
            parent: props.parentAddress,
            parentType: destinationParentType,
        };

        props.onDragItem({ source, destination });
    } catch (error) {
        throw new Error('Something went wrong when drop');
    }
}

export function handleHover({ props, monitor, ref }) {
    if (!monitor.canDrop()) return;

    if (!ref.current) {
        return;
    }

    const sourceItem = monitor.getItem();

    if (sourceItem.address === props.address) {
        return;
    }

    const source = {
        index: sourceItem.index,
        address: sourceItem.address,
        parent: sourceItem.parentAddress,
        numericAddress: getNumericAddress(sourceItem.address),
    };

    const destination = {
        index: props.index,
        address: props.address,
        parent: props.parentAddress,
        numericAddress: getNumericAddress(props.address),
    };

    // Determine rectangle on screen
    const hoverBoundingRect = ref.current?.getBoundingClientRect();
    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    // Get horizontal middle
    const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
    // Determine mouse position
    const clientOffset = monitor.getClientOffset();
    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // are we dragging right or left?
    const dragRight = source.numericAddress === destination.numericAddress - 1;
    const dragLeft = source.numericAddress === destination.numericAddress + 1;

    const hoverClientX = clientOffset.x - hoverBoundingRect.left;
    const upwards =
        source.numericAddress > destination.numericAddress &&
        hoverClientY > hoverMiddleY;
    const downwards =
        source.numericAddress < destination.numericAddress &&
        hoverClientY < hoverMiddleY;
    const leftwards =
        source.numericAddress > destination.numericAddress &&
        hoverClientX > hoverMiddleX;
    const rightwards =
        source.numericAddress < destination.numericAddress &&
        hoverClientX < hoverMiddleX;
    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%
    // Dragging downwards
    if (sourceItem.type === 'column') {
        if (dragLeft && leftwards) return;
        if (dragRight && rightwards) return;
    } else {
        // Moving down: exit if we're in upper half
        if (downwards) {
            return;
        }

        // Moving up: exit if we're in lower half
        if (upwards) {
            return;
        }
    }

    props.onDragItem({ source, destination });
    monitor.getItem().index = destination.index;
    monitor.getItem().address = destination.address;
    monitor.getItem().parentAddress = destination.parent;
}

export const handleCanDrop = (dragItem, overItem, getDataByAddress) => {
    try {
        const { type, address, parentType } = overItem;
        if (type === DND_TYPES.PAGE) {
            return true;
        }
        const isSameAddress = dragItem.address === address;
        const isParentAddress =
            dragItem.address && address.startsWith(`${dragItem.address}.`);
        if (isSameAddress || isParentAddress) return false;

        const { length: overItemAddressLength } = address.replace(/\./g, '');

        if (dragItem.component_label === 'nestedRow') {
            return parentType === COLUMN && overItemAddressLength === 4;
        }

        const isNestedRowColumnDifferent =
            overItem.item?.cms_column ^ dragItem.item?.cms_column ||
            overItem.item?.isNestedCmsRow ^ dragItem.item?.isNestedCmsRow;

        if (isNestedRowColumnDifferent) {
            return false;
        }

        const isNestedContainer =
            type === CONTAINER && overItemAddressLength > 2;
        const isTopRow =
            [CMS_ROW, ROW].includes(type) && 2 === overItemAddressLength;
        const isTopContainer =
            type === CONTAINER && 2 === overItemAddressLength;
        const isSameType = type === dragItem.type;
        const isComponentInsideContainer =
            type === COMPONENT && parentType === CONTAINER;

        const hasIntermediateSymbol =
            dragItem.type === CONTAINER &&
            (type === CONTAINER || isComponentInsideContainer) &&
            hasContainerSymbolInLayer({
                sourceItem: dragItem,
                targetItem: {
                    address: overItem.address,
                    ...(overItem.type === 'container' && {
                        symbolId: overItem.item?.symbolId,
                    }),
                },
                getDataByAddress,
            });

        //to avoid the infinite loop
        if (hasIntermediateSymbol) {
            return false;
        }

        const isDropAllowed =
            {
                row: isTopRow || isTopContainer,
                cmsRow: isTopRow || isTopContainer,
                component: isNestedContainer,
                container: isTopRow || isComponentInsideContainer,
            }[dragItem.type] || isSameType;

        return isDropAllowed;
    } catch (error) {
        throw new Error('drop allow failed');
    }
};

export const getDestinationAddress = ({ sourcePath, targetPath }) => {
    const source = [...sourcePath];
    const destination = [...targetPath];
    const sourceIndex = source.pop();
    const sliceTargetPath = destination.slice(0, source.length);
    const sliceLength = sliceTargetPath.length;

    const isMovingDown = Number(sourceIndex) < Number(destination[sliceLength]);

    if (String(source) === String(sliceTargetPath) && isMovingDown) {
        destination[sliceLength] = `${destination[sliceLength] - 1}`;

        return destination;
    }

    return destination;
};

export const onDrop = ({ data, props, isCMS, symbols, updaterFn }) => {
    const { source, destination } = props;
    const splitAddress = destination.address.split('.');
    const isNavTreeRootContainer =
        destination.type === 'container' &&
        destination.parentType === 'section';

    const shouldWrapComponentWithContainer =
        3 === splitAddress.length &&
        source.type === 'component' &&
        (destination.parentType === 'container' || isNavTreeRootContainer);

    const updatedSource = removeElementByAddress({
        data,
        isCMS,
        symbols,
        address: source.address,
    });

    const sourcePath = getElementAddress({
        data,
        isCMS,
        symbols,
        address: source.address,
    });

    const sourceElement = shouldWrapComponentWithContainer
        ? {
              ...createContainer({ size: '100' }),
              content: [updatedSource.removeElement],
          }
        : updatedSource.removeElement;

    const updatedDestination = insertElementByAddress({
        isCMS,
        data: updatedSource.data,
        address: destination.address,
        symbols: updatedSource.symbols,
        source: {
            path: sourcePath,
            element: sourceElement,
        },
    });

    updaterFn(updatedDestination);
};

export const removeElementByAddress = ({ address, data, symbols, isCMS }) => {
    const sourcePath = getElementAddress({
        data,
        isCMS,
        symbols,
        address,
    });

    let removeElement;

    const updateSrc = (content, index) => {
        [removeElement] = content.splice(index, 1);

        return content;
    };

    const updatedElements = updateElementByPath({
        data,
        symbols,
        path: sourcePath,
        updateFn: updateSrc,
    });

    return { ...updatedElements, removeElement };
};

export const insertElementByAddress = ({
    data,
    isCMS,
    source,
    symbols,
    address,
}) => {
    const targetPath = getElementAddress({
        data,
        isCMS,
        symbols,
        address,
    });

    const destinationPath = getDestinationAddress({
        targetPath,
        sourcePath: source.path,
    });

    const updateDest = (content, index) => {
        const item = source.symbolId
            ? { symbolId: source.symbolId, id: uuid() }
            : source.element;

        content.splice(index, 0, item);

        return content;
    };

    const updatedElements = updateElementByPath({
        data,
        symbols,
        updateFn: updateDest,
        path: destinationPath,
    });

    return updatedElements;
};

export const updateElementByPath = ({ data, symbols, path, updateFn }) => {
    const { address, addressInParent, parentSymbolId } = getElementContext({
        data,
        symbols,
        address: path,
    });

    if (parentSymbolId) {
        const symbol = symbols[parentSymbolId];
        const updated = updateEdgeContent(
            symbol.data,
            addressInParent,
            updateFn
        );
        const nextSymbols = {
            ...symbols,
            [parentSymbolId]: {
                ...symbol,
                data: updated,
            },
        };

        return { symbols: nextSymbols, data };
    } else {
        const updated = updateEdgeContent(data, address, updateFn);
        return { data: updated, symbols };
    }
};

/**
 * Handles the direction of a draggable element based on the position of the cursor.
 * @function handleDirection
 * @param {object} params - The parameters object.
 * @param {boolean} params.isOver - Whether the cursor is over the draggable element.
 * @param {string} params.itemType - The type of the draggable element.
 * @param {object} params.elementRef - The reference to the draggable element.
 * @param {function} params.setDirection - The function to set the direction of the draggable element.
 * @returns {function} - The callback function to handle the direction.
 * @throws {Error} - If isOver is falsy or elementRef is falsy.
 * @example
 *
 * const params = {
 *     isOver: true,
 *     itemType: 'column',
 *     elementRef: useRef(),
 *     setDirection: (direction) => console.log(direction)
 * };
 *
 *  <ItemWrapper
 *       isOver={isOver}
 *       ref={elementRef}
 *       itemType={item.type}
 *       onDragOver={handleDirection({
 *          isOver,
 *           elementRef,
 *           setDirection,
 *           itemType: item.type,
 *       })}
 * />
 *
 *
 */
export const handleDirection =
    ({ isOver, itemType, elementRef, setDirection }) =>
    ({ clientX = 0, clientY = 0 }) => {
        if (!isOver || !elementRef) return;

        const { left, top, width, height } =
            elementRef.current.getBoundingClientRect();
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        let direction;
        if (itemType === 'column') {
            direction = left + halfWidth >= clientX ? 'left' : 'right';
        } else {
            direction = top + halfHeight >= clientY ? 'top' : 'bottom';
        }

        setDirection(direction);
    };

const validPositions = ['relative', 'fixed', 'sticky', 'absolute'];

export const getPosition = (elementRef) => {
    if (!elementRef.current) return;
    const { position } = getComputedStyle(elementRef.current);

    return validPositions.includes(position) ? position : 'relative';
};

function checkSymbolInUpLayer({ address = '', getDataByAddress }) {
    const splitAddress = address.split('.');

    for (let i = splitAddress.length - 1; i > 0; i--) {
        const currentAddress = splitAddress.slice(0, i).join('.');
        const { symbolId } = getDataByAddress(currentAddress);

        if (symbolId) {
            return true;
        }
    }

    return false;
}

export function checkSymbolInBottomLayer({
    content,
    address = '',
    getDataByAddress,
}) {
    const nestedContainers = address
        ? getDataByAddress(address)?.content
        : content;

    if (!Array.isArray(nestedContainers)) return false;

    const checkContainersSymbol = (content) => {
        return content
            .filter(({ symbolId, type }) => {
                if (type === 'container') return true;
                if (symbolId) {
                    const data = getDataByAddress(null, symbolId);
                    return data.type === 'container';
                }
            })
            .some(hasSymbol);
    };

    const hasSymbol = (item) =>
        item.symbolId || checkContainersSymbol(item.content);

    return checkContainersSymbol(nestedContainers);
}

export const checkSymbolInLayer = (options) =>
    checkSymbolInUpLayer(options) || checkSymbolInBottomLayer(options);

export const hasContainerSymbolInLayer = ({
    sourceItem,
    targetItem,
    getDataByAddress,
}) => {
    let hasSymbolInSourceLayer;

    // while drag saved or symbols containers from sidebar
    if (sourceItem.info?.data) {
        const { symbolId, content } = sourceItem.info.data;
        hasSymbolInSourceLayer =
            !!symbolId ||
            checkSymbolInBottomLayer({ content, getDataByAddress });
        // while drag withing page
    } else {
        hasSymbolInSourceLayer =
            !!sourceItem.symbolId ||
            checkSymbolInLayer({
                getDataByAddress,
                address: sourceItem.address,
            });
    }

    const hasSymbolInTargetLayer =
        !!targetItem.symbolId ||
        checkSymbolInLayer({ address: targetItem.address, getDataByAddress });

    return hasSymbolInSourceLayer + hasSymbolInTargetLayer > 1;
};
