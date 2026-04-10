/*****************************************************
 * Packages
 ******************************************************/
import { ModalContextProvider, useRenderComponent } from '@dorik/html-parser';
import React, {
    Fragment,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { DragPreviewImage } from 'react-dnd';
import useDnD from '../hooks/useDnD';

/*****************************************************
 * Locals
 ******************************************************/
import { ThemeContext } from '../contexts/ThemeContext';
// import { getAuthUser } from '../redux/selectors';
import { prefix } from '../config';
import { editorType } from '../util/constant';
import getHideClass from '../util/getHideClass';
import idx from '../util/idx';

import { InteractiveComponent } from 'modules/CanvasElementRenderer/components/InteractiveComponent';
import { getPosition, handleDirection } from 'util/dndHelpers';
import { DND_TYPES, INLINE_EDITOR, NAVIGATION_TREE } from '../constants/index';
import { getElementClass } from '../util/getClassName';
import { DnDWrapper } from './DnDWrapper';
import {
    DnDElementContext,
    DnDElementProvider,
} from 'modules/CanvasElementRenderer/context/DnDElementContext';
import { extractElementStyle } from 'modules/CanvasElementRenderer/utils/extractElementStyle';
import { useCanvasContext } from 'contexts/CanvasContext';

const { ROW, CMS_ROW, COLUMN, CONTAINER, SECTION } = DND_TYPES;

const ComponentRenderer = (props) => {
    const {
        item,
        page,
        siteId,
        address,
        children,
        parentType,
        editorLayout,
        parentAddress,
    } = props;
    const [direction, setDirection] = useState('top');

    const {
        user,
        global,
        permission,
        loadingState,
        symbols = {},
        pageSettings,
        settingsModal,
        previewMapper,
        onSaveSettings,
        onClickSettings,
        currentEditAddress,
        onElementRightClick,
        cleanUpElementEditMode,
        isConfirmationModalOpen,
        settingsModalTriggerFrom,
        getReferenceForNavTreeEl,
    } = useCanvasContext();

    const { focusedAddress, setFocusedAddress, isDraggingBoundary } =
        useContext(DnDElementContext);

    const elementRef = useRef(null);
    const {
        isOver,
        canDrop,
        isDragging,
        connectDropTarget,
        connectDragSource,
        connectDragPreview,
    } = useDnD({ ...props, direction });

    let isAdmin = user?.role === 'sys_admin';
    let settingsWindowVisible;

    const [borderVisible, setBorderVisible] = useState(false);
    const [isControlFrozen, setControlFrozen] = useState(false);
    const [isControlVisible, setControlVisibility] = useState(false);
    const [isTextEditorActive, setTextEditorActive] = useState(false);
    const { elementControls } = useContext(ThemeContext);
    const getControlColor = (item) => {
        const type = item.isNestedCmsRow ? 'cmsRow' : item.component_label;
        const controlColor = {
            nestedRow: 'nestedRow',
            nestedCol: 'nestedCol',
            cmsRow: 'cmsRow',
        }[type];
        return controlColor || item.type;
    };

    const className = getElementClass(item);
    const isBannerPage = page.ref === 'SUBSCRIPTION_BANNER';

    // eslint-disable-next-line testing-library/render-result-naming-convention
    const Component = useRenderComponent({
        item,
        permission,
        renderer: 'BUILDER',
    });
    const elementAddress = address.split('.');

    // check if specific section is created/regenerated
    const isSectionRegenerated =
        elementAddress[0] === loadingState.elAddress &&
        loadingState.sectionCreated;

    // check if generating section or element
    const enableElementControl = address === loadingState.elAddress;

    const isBorderVisible =
        [COLUMN, ROW, CMS_ROW, SECTION, CONTAINER].includes(item.type) &&
        !['nestedRow', 'nestedCol'].includes(item.component_label);
    const shouldType = isSectionRegenerated || loadingState.site;

    const color = item.symbolId
        ? elementControls.symbol
        : elementControls[getControlColor(item)] || elementControls.default;

    const showContextMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isBannerPage) return;
        const { clientX, clientY } = e;
        onElementRightClick({
            contextMenuPosition: { clientX, clientY },
            address,
            elRef: elementRef,
        });
    };

    // Column Size. e.g: 1/2
    const getColSizeClasses = useCallback(() => {
        const lg = idx(item, (props) => props.attr.__class__columnSize);
        const md = idx(
            item,
            (props) => props.media.tablet.attr.__class__columnSize
        );
        const xs = idx(
            item,
            (props) => props.media.mobile.attr.__class__columnSize
        );
        let classes = '';
        if (lg) {
            classes += ` col-lg-${lg}`;
        }
        if (md) {
            classes += ` col-md-${md}`;
        }
        if (xs) {
            classes += ` col-xs-${xs}`;
        }
        return classes;
    }, [item]);

    let isPopup = false;
    const isRow = item.type === 'row' || item.type === 'cmsRow';
    const isButton = item.type === 'button';
    const isIcon = item.type === 'icon';
    let isInline = false;
    const isParentRow = isRow && item.component_label !== 'nestedRow';
    let container = isParentRow ? 'container' : '';
    if (isParentRow && item.wrapper && item.wrapper.width === '100%') {
        container = 'container-fluid';
    }
    if (isButton && item.settings) {
        isInline = item.settings.inlineButton;
    }
    if (isIcon && item.settings) {
        isInline = item.settings.inlineIcon;
    }
    if (isRow) {
        isPopup = item.settings?.popup;
    }

    const hiddenClass = getHideClass(item?.settings?.hideOn);

    // Element wrapper class
    const itemClass = `${prefix}-${item.type}-${item.id}`;
    const symbolClass = !!item.symbolId && `symbol--${item.symbolId}`;
    const itemWrapperClasses = [
        getColSizeClasses(),
        container,
        'element-wrapper',
        `${symbolClass || itemClass}-wrapper`,
        isInline ? 'el-ib' : '',
        isPopup ? 'builder-popup-row' : '',
        hiddenClass,
    ];
    const wrapperClass = itemWrapperClasses
        .filter(Boolean)
        .map((v) => v.trim())
        .join(' ');

    connectDropTarget(elementRef);

    const freezeControlVisibility = React.useCallback(
        (boolean) => setControlFrozen(boolean),
        []
    );

    const triggerControlVisibility = useCallback((value) => {
        setTextEditorActive(!value);
    }, []);

    const handleMouseEnter = useCallback(() => {
        if (!isTextEditorActive && !isDraggingBoundary) {
            setBorderVisible(true);
            setControlVisibility(true);
            setFocusedAddress(address);
        }
    }, [isTextEditorActive, isDraggingBoundary, setFocusedAddress, address]);

    const handleMouseLeave = useCallback(() => {
        if (!isControlFrozen && !isTextEditorActive && !isDraggingBoundary) {
            setBorderVisible(false);
            setControlVisibility(false);
            setFocusedAddress(parentAddress);
        }
    }, [
        isControlFrozen,
        isTextEditorActive,
        isDraggingBoundary,
        setFocusedAddress,
        parentAddress,
    ]);

    const handleMouseMove = useCallback(
        (event) => {
            event.stopPropagation();
            handleMouseEnter();
        },
        [handleMouseEnter]
    );

    const isInlineEditorActive = settingsModalTriggerFrom === INLINE_EDITOR;
    const isCurrentlyFocused = address === focusedAddress;

    const handleSingleClick = useCallback(
        (e) => {
            // To prevent the default action if any closest elements are anchor tags.
            if (e.target.closest('a')) e.preventDefault();

            // stop event if the page is banner and click item is not banner-element
            if (isBannerPage && address !== '0.0.0.0') {
                e.stopPropagation();
                return;
            }
            if (settingsModal === 'CONTEXT_MENU') {
                cleanUpElementEditMode();
            } else {
                e.stopPropagation();
                if (!isConfirmationModalOpen) {
                    onClickSettings(address);
                }
            }
        },
        [
            address,
            cleanUpElementEditMode,
            onClickSettings,
            settingsModal,
            isConfirmationModalOpen,
            isBannerPage,
        ]
    );

    // MIGRATION
    useEffect(() => {
        let timeoutId;

        if (Component?.migration) {
            Component.migration(item, (payload) => {
                timeoutId = setTimeout(() => {
                    onSaveSettings(payload, address, true);
                }, 1);
            });
        }
        return () => {
            if (Component?.migration) {
                clearTimeout(timeoutId);
            }
        };
    }, [Component]);

    const _currentEditAddress = currentEditAddress();
    useEffect(() => {
        if (
            _currentEditAddress === address &&
            settingsModalTriggerFrom === NAVIGATION_TREE
        ) {
            getReferenceForNavTreeEl(elementRef);
            elementRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [_currentEditAddress, address, settingsModalTriggerFrom]);

    useEffect(() => {
        return () => {
            setFocusedAddress?.(null);
        };
    }, []);

    const renderBorder =
        !isInlineEditorActive &&
        (!isBannerPage || item.type === 'subscriptionBanner') &&
        !isConfirmationModalOpen &&
        (borderVisible || currentEditAddress() === address);

    const isBorderActive = currentEditAddress() === address;

    let controlVisible =
        enableElementControl ||
        (!isInlineEditorActive &&
            (isCurrentlyFocused || isBorderVisible) &&
            !isBannerPage &&
            !isConfirmationModalOpen &&
            ((editorLayout === editorType.SIDEBAR && isControlVisible) ||
                (!settingsWindowVisible && isControlVisible)));

    if (!Component) {
        // TODO: Bug report to sentry
        return null;
    }

    const renderControlProps = {
        ref: elementRef,
        style: {
            position: getPosition(elementRef),
            opacity: isDragging ? 0.2 : 1,
        },
        onClick: handleSingleClick,
        onContextMenu: showContextMenu,
        onMouseLeave: handleMouseLeave,
        onMouseEnter: handleMouseEnter,
        ...(focusedAddress === null && {
            onMouseMove: handleMouseMove,
        }),
        onDragOver: handleDirection({
            itemType: item.type,
            setDirection,
            elementRef,
            isOver,
        }),
        'data-testid': `${props.type}-${props.address}`,
    };

    return (
        <>
            <ModalContextProvider
                value={{ popupSetting: pageSettings?.popupSetting }}
            >
                <DragPreviewImage
                    connect={connectDragPreview}
                    src={`/assets/images/${item.type}.png`}
                />

                <DnDWrapper
                    item={item}
                    color={color}
                    siteId={siteId}
                    isOver={isOver}
                    address={address}
                    canDrop={canDrop}
                    direction={direction}
                    isDragging={isDragging}
                    parentType={parentType}
                    renderBorder={renderBorder}
                    wrapperClass={wrapperClass}
                    isBannerPage={isBannerPage}
                    isBorderActive={isBorderActive}
                    controlVisible={controlVisible}
                    connectDragSource={connectDragSource}
                    renderControlProps={renderControlProps}
                    isTextEditorActive={isTextEditorActive}
                    setControlVisibility={setControlVisibility}
                    freezeControlVisibility={setControlVisibility}
                >
                    {(props) => {
                        return (
                            <>
                                {extractElementStyle({
                                    global,
                                    symbols,
                                    parentType,
                                    element: item,
                                })}
                                <Component
                                    item={item}
                                    address={address}
                                    date={global?.date}
                                    className={className}
                                    permission={permission}
                                    shouldType={shouldType}
                                    interactionDisabled={false}
                                    previewMapper={previewMapper}
                                    onSaveSettings={onSaveSettings}
                                    InteractiveComponent={InteractiveComponent}
                                    isInlineEditorActive={
                                        isInlineEditorActive &&
                                        address === _currentEditAddress
                                    }
                                    attrs={{
                                        onClick: (e) => e.preventDefault(),
                                    }}
                                    triggerControlVisibility={
                                        triggerControlVisibility
                                    }
                                    wrapperClass={wrapperClass.trim()}
                                    renderer="BUILDER"
                                    isAdmin={isAdmin}
                                    siteId={siteId}
                                    page={page}
                                    {...props}
                                >
                                    {children}
                                </Component>
                            </>
                        );
                    }}
                </DnDWrapper>
            </ModalContextProvider>
        </>
    );
};

export const DnDElement = (props) => {
    const Wrapper = props.type === 'section' ? DnDElementProvider : Fragment;

    return (
        <Wrapper>
            <ComponentRenderer {...props} />
        </Wrapper>
    );
};
