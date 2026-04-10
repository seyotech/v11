import React, { useCallback, useContext, useMemo } from 'react';

import { DnDElement } from './DnDElement';
import { appNameEnums } from './../constants';
import ButtonAddNew from './other-components/ButtonAddNew';
import { useCanvasContext } from 'contexts/CanvasContext';
import EmptyDropTarget from './other-components/EmptyDropTarget/EmptyDropTarget';

const getElType = (parentType) => {
    const elTypes = {
        page: 'SECTION',
        section: 'ROW',
        cmsRow: 'CMSROW',
        row: 'COLUMN',
        column: 'ELEMENT',
        container: 'ELEMENT',
    };
    if (!elTypes.hasOwnProperty(parentType)) {
        throw new Error(`No element type found for '${parentType}'`);
    }
    return elTypes[parentType];
};

const getAddress = (parentAddress, index) => {
    return (parentAddress ? `${parentAddress}.` : '') + index;
};

const cmsSpecificElements = [
    'tags',
    'cmsRow',
    'search',
    'blogWidget',
    'postContent',
    'searchWidget',
];
const preRenderValidation = ({ item, appName = 'STATIC' }) => {
    const itemTypeExists = !!item?.type;

    if (!itemTypeExists) {
        return false;
    }

    if (appName === appNameEnums.STATIC) {
        // Exclude cms specific element for STATIC app
        return !cmsSpecificElements.includes(item.type);
    }

    return true;
};

const Element = React.memo(
    ({
        page,
        type,
        index,
        item,
        siteId,
        content,
        onDragItem,
        parentType,
        editorLayout,
        parentAddress,
    }) => {
        const address = getAddress(parentAddress, index);
        const memoizedChildren = useMemo(() => {
            return Array.isArray(content) ? (
                <RecursiveRender
                    page={page}
                    type={type}
                    siteId={siteId}
                    content={content}
                    onDragItem={onDragItem}
                    parentAddress={address}
                    editorLayout={editorLayout}
                />
            ) : (
                content
            );
        }, [address, content, editorLayout, onDragItem, page, siteId, type]);

        return (
            <DnDElement
                page={page}
                item={item}
                type={type}
                key={item.id}
                index={index}
                siteId={siteId}
                address={address}
                parentType={parentType}
                onDragItem={onDragItem}
                editorLayout={editorLayout}
                isLast={index === length - 1}
                parentAddress={parentAddress}
            >
                {memoizedChildren}
            </DnDElement>
        );
    }
);

const RecursiveRender = React.memo(function _RecursiveRender(props) {
    const {
        type,
        page,
        siteId,
        content,
        onDragItem,
        editorLayout,
        parentAddress,
    } = props;
    const { symbols, showAddModal, appName } = useCanvasContext();

    const parseSymbol = React.useCallback(
        (item) => {
            return 'symbolId' in (item || {})
                ? { ...symbols[item.symbolId]?.data, ...item }
                : item;
        },
        [symbols]
    );

    const handleAddNew = useCallback(
        (e) => {
            e.stopPropagation();
            e.preventDefault();
            showAddModal(getElType(type), `${getAddress(parentAddress, '-1')}`);
        },
        [parentAddress, showAddModal, type]
    );

    const memoizedElements = useMemo(() => {
        return Array.isArray(content) && content.length ? (
            content
                .map(parseSymbol)
                .map((item, index) =>
                    preRenderValidation({ item, appName }) ? (
                        <Element
                            page={page}
                            item={item}
                            index={index}
                            key={item.id}
                            siteId={siteId}
                            type={item.type}
                            parentType={type}
                            onDragItem={onDragItem}
                            content={item.content}
                            editorLayout={editorLayout}
                            parentAddress={parentAddress}
                        />
                    ) : null
                )
                .filter(Boolean)
        ) : (
            <EmptyDropTarget
                isEmpty
                type={type}
                onDragItem={onDragItem}
                parentAddress={parentAddress}
                address={getAddress(parentAddress, 0)}
            >
                <ButtonAddNew
                    type={type}
                    onClick={handleAddNew}
                    address={parentAddress}
                />
            </EmptyDropTarget>
        );
    }, [
        type,
        page,
        content,
        siteId,
        appName,
        onDragItem,
        parseSymbol,
        editorLayout,
        handleAddNew,
        parentAddress,
    ]);

    return <>{memoizedElements}</>;
});

export default RecursiveRender;
