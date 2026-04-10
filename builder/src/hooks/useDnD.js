import { useDrag, useDrop } from 'react-dnd';

import { DND_TYPES } from '../constants';
import { getDnDConfig, handleCanDrop, handleDrop } from '../util/dndHelpers';
import { useCanvasContext } from 'contexts/CanvasContext';
import { generateDataWithParentElements } from 'modules/Shared/util/generateDataWithParentElements';

const useDnD = (props) => {
    const dndConfig = getDnDConfig(props.type);
    const { addElement, getDataByAddress, getElement } = useCanvasContext();

    const shallow = [DND_TYPES.COMPONENT, DND_TYPES.CONTAINER].includes(
        dndConfig.type
    );

    const [{ canDrop, isOver }, connectDropTarget] = useDrop(
        {
            accept: dndConfig.accept,
            canDrop: (item, monitor) => {
                // Here is a workaround to prevent the glitch in react-dnd that interferes with dragging
                const { x, y } = monitor.getDifferenceFromInitialOffset();
                const isMinimallyMoved = Math.hypot(x, y) > 15;

                return (
                    isMinimallyMoved &&
                    handleCanDrop(
                        item,
                        {
                            ...props,
                            type: dndConfig.type,
                        },
                        getDataByAddress
                    )
                );
            },
            collect: (monitor) => ({
                canDrop: !!monitor.canDrop(),
                isOver: !!monitor.isOver({ shallow }),
            }),
            drop: async (item, monitor) => {
                const didDrop = monitor.didDrop();
                const canDrop = monitor.canDrop();

                if (didDrop || !canDrop) return;

                let offset = 0;
                if (['bottom', 'right'].includes(props.direction)) {
                    offset = item.info ? 0 : 1;
                } else {
                    offset = item.info ? -1 : 0;
                }

                let insertAddress = props.address.replace(
                    /\d$/gi,
                    (m) => `${Number(m) + offset}`
                );

                if (item.info) {
                    const { shouldFetchData, id, ...rest } = item.info;
                    let payload = { ...item.info, insertAddress };

                    if (shouldFetchData) {
                        const data = await getElement(id);
                        const parsedData = JSON.parse(data);
                        if (parsedData) {
                            payload = {
                                ...rest,
                                data: parsedData,
                                insertAddress,
                            };
                        }
                    }
                    if (dndConfig.type === DND_TYPES.PAGE) {
                        let data = payload.data;
                        if (payload.type !== DND_TYPES.SECTION) {
                            data = generateDataWithParentElements({
                                dragData: payload.data,
                                dragType: payload.type,
                            });
                        }

                        const nextEditAdress = {
                            section: '0',
                            row: '0.0',
                            cmsRow: '0.0',
                            column: '0.0.0',
                            component: '0.0.0.0',
                            container: payload.data ? '0.0.0.0' : '0.0',
                        }[payload.type];

                        payload = {
                            ...payload,
                            data,
                            type: DND_TYPES.SECTION,
                            elType: DND_TYPES.SECTION.toUpperCase(),
                            addElType: DND_TYPES.SECTION.toUpperCase(),
                            nextEditAdress,
                        };
                    }
                    addElement(payload);
                    return;
                }

                handleDrop({ ...props, address: insertAddress }, item);
            },
        },
        [props]
    );
    const [{ isDragging, itemAddress }, connectDragSource, connectDragPreview] =
        useDrag(
            {
                type: dndConfig.type,
                item: {
                    type: dndConfig.type,
                    index: props.index,
                    siteId: props.siteId,
                    address: props.address,
                    parentType: props.parentType,
                    symbolId: props.item?.symbolId,
                    parentAddress: props.parentAddress,
                    component_label: props.item?.component_label,
                },
                isDragging: (monitor) => {
                    return props.address === monitor.getItem().address;
                },
                collect: (monitor) => {
                    const item = monitor.getItem();
                    return {
                        itemAddress: item?.address,
                        isDragging: monitor.isDragging(),
                    };
                },
            },
            [props]
        );

    return {
        isOver,
        canDrop,
        isDragging,
        itemAddress,
        connectDropTarget,
        connectDragSource,
        connectDragPreview,
    };
};

export default useDnD;
