/*****************************************************
 * Packages
 ******************************************************/
import React, { useRef, useCallback } from 'react';
import styled from 'styled-components';
import condition from 'dynamic-condition';
import { useDrop, useDrag } from 'react-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/*****************************************************
 * Helpers
 ******************************************************/
import uniqId from '../../util/uniqId';
import getPathValue from '../../util/getPathValue';
import resolveValues from '../../util/resolveValues';

/*****************************************************
 * Components
 ******************************************************/
import RenderComponent from './core/RenderComponent';
import Accordion, {
    AccordionDetails,
    AccordionSummary,
    AccordionDraggable,
} from '../other-components/Accordion';
import Label from './Label/Label';
import useEditorModal from '../../hooks/useEditorModal';
import Button from '../other-components/Button';

function ListItems({ currentEditItem, module, handleChange: onChange }) {
    const { path, modules, actions = [] } = module;
    const data = getPathValue(path, currentEditItem) || [];
    const { isSidebar } = useEditorModal();

    const getDefaultValues = React.useCallback(
        (item) => {
            return modules
                .filter((mod) => mod.key !== 'type' && mod.content.defaultValue)
                .filter(
                    (mod) =>
                        !mod.conditions ||
                        condition(resolveValues(mod.conditions, item)).matches
                )
                .map((mod) => ({
                    key: mod.key,
                    value: mod.content.defaultValue,
                }));
        },
        [modules]
    );

    const handleChange = useCallback(
        (payload, index) => {
            const data = getPathValue(path, currentEditItem) || [];
            const copyData = [...data];
            const item = { ...copyData[index] };

            // TODO: handle array payload
            payload = Array.isArray(payload) ? payload : [payload];
            payload.forEach(mutateItem);
            copyData[index] = item;
            onChange({ name: path, value: copyData });

            // TODO: make it reusable and compatible with Root function in builder.js
            function mutateItem({ name, value }) {
                name.split('/').reduce((acc, key, index, arr) => {
                    if (arr.length - 1 === index) {
                        acc[key] = value;
                        return acc;
                    } else {
                        if (!acc[key]) {
                            acc[key] = {};
                        }
                        return (acc[key] = { ...acc[key] });
                    }
                }, item);

                if (payload.name === 'type') {
                    if (payload.value !== 'acceptance') {
                        delete item.content;
                    }
                    getDefaultValues(item).forEach(
                        ({ key, value }) => (item[key] = value)
                    );
                }
            }
        },
        [currentEditItem, getDefaultValues, onChange, path]
    );

    const moveItem = useCallback(
        (dragIndex, hoverIndex) => {
            const items = [...data];
            const [dragItem] = items.splice(dragIndex, 1);
            items.splice(hoverIndex, 0, dragItem);
            onChange({ name: path, value: items });
        },
        [data, onChange, path]
    );

    const addNewItem = useCallback(() => {
        // TODO: add a default label/content if available in module
        const result = { id: uniqId() };
        const copyData = [...data];
        copyData.push(result);
        onChange({ name: path, value: copyData });
    }, [data, onChange, path]);

    const removeItem = useCallback(
        (index) => {
            const copyData = [...data];
            copyData.splice(index, 1);
            onChange({ name: path, value: copyData });
        },
        [data, onChange, path]
    );

    const cloneItem = useCallback(
        (index) => {
            const copyData = [...data];
            const clone = { ...data[index], id: uniqId() };
            copyData.splice(index, 0, clone);
            onChange({ name: path, value: copyData });
        },
        [data, onChange, path]
    );

    return (
        <>
            <Accordion
                size="sm"
                type="box"
                onlyIconToggle
                // onExpend={handleExpend}
                expendedIcon="chevron-up"
                collapsedIcon="chevron-down"
            >
                {data.map((item, index) => (
                    <Draggable
                        item={item}
                        key={item.id}
                        index={index}
                        actions={actions}
                        modules={modules}
                        moveItem={moveItem}
                        isSidebar={isSidebar}
                        cloneItem={cloneItem}
                        removeItem={removeItem}
                        handleChange={handleChange}
                    />
                ))}
            </Accordion>

            {actions.includes('add') && (
                <div style={{ marginTop: 15 }}>
                    <Button
                        size="sm"
                        width="100%"
                        border="dotted"
                        onClick={addNewItem}
                    >
                        + Add New
                    </Button>
                </div>
            )}
        </>
    );
}

export default ListItems;

function RenderTemplate({ module, ...restOfProps }) {
    const { item, itemIndex, onChange } = restOfProps;
    const value = getPathValue(module.key, item);
    const handleChange = (payload) => {
        onChange(payload, itemIndex);
    };
    const { dependentsValue, resetDep = true } = module;

    const getDependentsPayload = useCallback(
        (dependentsValue) => {
            const getInitValue = ([path, initVal]) => {
                if (!resetDep) {
                    const value = getPathValue(path, value);
                    if (value === undefined) {
                        return { name: path, value: initVal };
                    }
                } else {
                    return { name: path, value: initVal };
                }
            };
            return Object.entries(dependentsValue)
                .map(getInitValue)
                .filter((v) => v);
        },
        [value, resetDep]
    );

    const handleChangeWithDependents = useCallback(
        (payload) => {
            if (dependentsValue) {
                const newPayload = [
                    payload,
                    ...getDependentsPayload(dependentsValue),
                ];
                handleChange(newPayload);
            } else {
                handleChange(payload);
            }
        },
        [dependentsValue, getDependentsPayload, handleChange]
    );

    if (
        module.conditions &&
        !condition(resolveValues(module.conditions, item)).matches
    ) {
        return null;
    }

    if (module.modules) {
        return (
            <>
                {itemIndex !== undefined && module.label && (
                    <Label module={module}>{module.label}</Label>
                )}

                {module.modules.map((childMod, modIndex) => (
                    <RenderTemplate
                        key={modIndex}
                        index={modIndex}
                        module={childMod}
                        parentModule={module}
                        {...restOfProps}
                    />
                ))}
            </>
        );
    }

    return (
        <RenderComponent
            data={item}
            value={value}
            module={module}
            path={module.key}
            onChange={handleChangeWithDependents}
        />
    );
}

const ItemTypes = {
    ACCORDION: 'ACCORDION',
};

const Text = styled.span`
    flex: 1;
    padding: 0 15px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

const Icon = styled.span`
    border-style: solid;
    border-width: 0 1px 0 0;
    border-color: ${({ theme }) => theme.borderPaleGrey};
`;

function Draggable({
    item,
    index,
    modules,
    actions,
    moveItem,
    isSidebar,
    draggable,
    cloneItem,
    removeItem,
    handleChange,
    ...restOfProps
}) {
    const itemLabel = getItemLabel(item);
    const ref = useRef(null);
    const [, drop] = useDrop({
        accept: ItemTypes.ACCORDION,
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }
            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // Determine mouse position
            const clientOffset = monitor.getClientOffset();
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            // Time to actually perform the action
            moveItem(dragIndex, hoverIndex);
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
    });
    const [{ isDragging }, drag, preview] = useDrag({
        type: ItemTypes.ACCORDION,
        item: () => ({ id: item.id, index }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    const opacity = isDragging ? 0 : 1;
    drag(drop(ref));

    return (
        <AccordionDraggable
            gap={isSidebar ? 10 : 20}
            ref={preview}
            style={{ opacity }}
            {...restOfProps}
        >
            <AccordionSummary>
                {actions.includes('drag') && (
                    <Icon
                        ref={ref}
                        className="icon"
                        style={{
                            marginLeft: -20,
                            cursor: 'move',
                            borderRightWidth: 1,
                        }}
                    >
                        <FontAwesomeIcon icon={['far', 'arrows-alt']} />
                    </Icon>
                )}
                <Text>{itemLabel}</Text>
                {actions.includes('clone') && (
                    <Icon
                        className="icon"
                        style={{ borderLeftWidth: 1 }}
                        onClick={() => cloneItem(index)}
                    >
                        <FontAwesomeIcon icon={['far', 'clone']} />
                    </Icon>
                )}
                {actions.includes('remove') && (
                    <Icon
                        className="icon"
                        onClick={() => removeItem(index)}
                        style={{
                            borderLeftWidth: actions.includes('clone') ? 0 : 1,
                        }}
                    >
                        <FontAwesomeIcon icon={['far', 'trash-alt']} />
                    </Icon>
                )}
            </AccordionSummary>
            <AccordionDetails isSidebar={isSidebar}>
                {modules.map((module, modIndx) => (
                    <RenderTemplate
                        item={item}
                        key={modIndx}
                        module={module}
                        itemIndex={index}
                        onChange={handleChange}
                    />
                ))}
            </AccordionDetails>
        </AccordionDraggable>
    );
}

function getItemLabel(item) {
    if (item.content) {
        const el = document.createElement('div');
        el.innerHTML = item.content;
        if (el.textContent.trim()) {
            return el.textContent.trim();
        }
    }
    if (item.label) return item.label;

    if (item.font?.fontFamily) {
        return item.font.fontFamily;
    }
}
