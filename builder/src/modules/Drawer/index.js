import { Drawer as AntDrawer } from 'antd';
import styled from 'styled-components';

import { ElementContext } from 'contexts/ElementRenderContext';
import { CustomDragLayer } from 'modules/CustomDragLayer';
import { useContext, useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { AIQuickSuggestion, Library } from '../Component/components/index';
import { Elements } from '../Element';
import { MediaLibrary } from '../MediaLibrary/components';
import { Navigation } from '../Navigation/components';
import { Pages } from '../Page/components';

const drawers = {
    pages: Pages,
    navigation: Navigation,
    components: Library,
    elements: Elements,
    mediaLibrary: MediaLibrary,
    aiQuickSuggestion: AIQuickSuggestion,
};

const Stc = styled.div`
    & .ant-drawer-body {
        padding: 0;
        border: 1px solid #f0f0f0;
    }

    & .ant-drawer-content-wrapper {
        box-shadow: none;
    }
`;

export const Drawer = ({
    isOpen,
    drawerName,
    mask = false,
    placement = 'left',
    ...rest
}) => {
    const { handleDrawer } = useContext(ElementContext);
    const isOverDrawerRef = useRef(null);
    const fromDrawerRef = useRef(null);
    const DrawerContent = drawers[drawerName];
    const isDrawerAllowedForCustomDragPreview = [
        'components',
        'mediaLibrary',
    ].includes(drawerName);
    const [{ isOver, item }, connectDropTarget] = useDrop(
        {
            accept: isDrawerAllowedForCustomDragPreview
                ? [
                      'row',
                      'column',
                      'cmsRow',
                      'section',
                      'container',
                      'component',
                  ]
                : [],
            canDrop: (item, monitor) => {
                return false;
            },
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
                item: monitor.getItem(),
            }),
        },
        [drawerName]
    );

    const isCustomDragPreviewAllowed =
        isDrawerAllowedForCustomDragPreview &&
        (item?.isFromDrawer || fromDrawerRef.current);

    useEffect(() => {
        if (isDrawerAllowedForCustomDragPreview && !!item) {
            //tracking  the previous value of isOver while dragging from mediaLibrary and components modal
            isOverDrawerRef.current = isOver;
        }

        if (!item) {
            //reseting after dragging is finished
            isOverDrawerRef.current = null;
            fromDrawerRef.current = null;
        } else {
            //tracking  the previous value of item?.isFromDrawer
            fromDrawerRef.current = item?.isFromDrawer;
        }
    }, [isOver, isDrawerAllowedForCustomDragPreview, item]);

    if (!DrawerContent) return null;
    const afterOpenChange = (open) => {
        if (!open) {
            handleDrawer({ drawerName: null });
        }
    };

    return (
        <>
            <Stc>
                <AntDrawer
                    width={260}
                    mask={mask}
                    open={isOpen}
                    getContainer={false}
                    data-testid="drawer"
                    placement={placement}
                    rootClassName="sidebar-drawer"
                    styles={{
                        header: {
                            display: 'none',
                        },
                    }}
                    afterOpenChange={afterOpenChange}
                >
                    <div
                        ref={connectDropTarget}
                        style={{ minHeight: '100%', width: '260px' }}
                    >
                        <DrawerContent {...rest} />
                    </div>
                </AntDrawer>
            </Stc>
            <CustomDragLayer
                isOutSideDrawer={
                    !isOver &&
                    (isOverDrawerRef.current ||
                        null === isOverDrawerRef.current) &&
                    !!item
                }
                isCustomDragPreviewAllowed={isCustomDragPreviewAllowed}
            />
        </>
    );
};
