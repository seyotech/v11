/*****************************************************
 * Packages
 ******************************************************/
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { forwardRef, memo, useCallback, useContext } from 'react';
/*****************************************************
 * Locals
 ******************************************************/
import { t } from 'i18next';
import { getResponsiveValue } from 'modules/Shared/util/getConditionalPathAndValue';
import { prefix } from '../config';
import { DND_TYPES } from '../constants';
import { ElementContext } from '../contexts/ElementRenderContext';
import GenerateTextComp from './AdvanceComponents/GenerateTextComp';
import {
    Btn,
    ControlGroup,
    Controls,
    FooterControls,
} from './ElementControl.stc';
import Tooltip from './Tooltip';

const getNumericAddress = (address) => Number(address.split('.').join(''));

const tooltipText = {
    SECTION: {
        move: 'Drag and Move Section',
        edit: 'Edit Section Style',
        clone: 'Duplicate Section',
        save: 'Save Section into Collection',
        remove: 'Delete Section',
        add: 'Add New Section Below',
    },
    ROW: {
        move: 'Drag and Move Row',
        edit: 'Edit Row Style',
        clone: 'Duplicate Row',
        save: 'Save Row into Collection',
        remove: 'Delete Row',
        add: 'Add New Row Below',
    },
    ELEMENT: {
        move: 'Drag and Move Element',
        edit: 'Edit Element',
        clone: 'Duplicate Element',
        save: 'Save Element into Collection',
        remove: 'Delete Element',
        add: 'Add New Element Below',
    },
    COLUMN: {
        move: 'Drag and Move Column',
        edit: 'Edit Column',
        switch: 'Modify Column Size',
        more: 'Show More Options',
        remove: 'Delete Column',
        colSize: 'Quick Change Column Size',
        add: 'Add New Column',
    },
    CONTAINER: {
        move: 'Drag and Move Container',
        edit: 'Edit Container',
        switch: 'Modify Container Size',
        more: 'Show More Options',
        remove: 'Delete Container',
        colSize: 'Quick Change Container Size',
        add: 'Add New Container',
    },
};

const renderType = (item) => {
    const { _elType, component_label } = item;

    if (component_label === 'nestedRow') {
        return tooltipText['ELEMENT'];
    } else {
        return tooltipText[_elType];
    }
};

const ActionButton = forwardRef(({ icon, children, ...props }, ref) => {
    return (
        <Btn {...props} ref={ref}>
            {icon && <FontAwesomeIcon icon={icon} />}
            <span>{children}</span>
        </Btn>
    );
});

function getControlTypeStyle(props) {
    const { item, address } = props;
    const { type: elType } = item;
    if (elType === 'section') {
        const numAddr = getNumericAddress(address);
        return { left: 0, top: numAddr === 0 ? '0' : '-20px' };
    } else if (elType === 'column') {
        return { left: 0, top: 0 };
    } else if (elType === 'row') {
        const numAddr = getNumericAddress(address);
        if (item.component_label) {
            return {
                left: '50%',
                top: numAddr === 0 ? 0 : '0',
                transform: 'translate(-50%)',
            };
        }
        return {
            left: '50%',
            top: numAddr === 0 ? 0 : '-20px',
            transform: 'translate(-50%)',
        };
    } else if (elType === 'cmsRow') {
        const numAddr = getNumericAddress(address);
        return {
            left: '50%',
            top: numAddr === 0 ? 0 : '-20px',
            transform: 'translate(-50%)',
        };
    } else if (elType === 'container') {
        if (address.length > 3) {
            return { left: 0, top: 0 };
        }
        return {
            top: 0,
            left: '50%',
            transform: 'translate(-50%)',
        };
    } else {
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
}

const isCmsRow = (item) => {
    return item.cms_column || item.isNestedCmsColumn;
};

const shouldRender = {
    move: (item) => {
        return (
            !isCmsRow(item) &&
            item.component_label !== 'nestedCol' &&
            !item.configuration?.selectedField
        );
    },
    size: (item) => {
        return [DND_TYPES.COLUMN, DND_TYPES.CONTAINER].includes(item.type);
    },
    delete: (item) => {
        return !isCmsRow(item);
    },
    add: (item) => {
        return item.component_label !== 'nestedCol' && !item.cms_column;
    },
    symbol: (isSymbol) => {
        return isSymbol;
    },
    addColumn: (item) => {
        return item.type === 'column' && !item.component_label;
    },
    regenerate: (item) => {
        return item.type === 'section' && !!item?.settings?.aiConfig;
    },
    generateText: (item) => {
        return ['text', 'heading'].includes(item.type);
    },
};

function getControlStyle(props) {
    return {
        display: 'flex',
        fontSize: '12px',
        borderRadius: '3px',
        position: 'absolute',
        whiteSpace: 'nowrap',
        transition: 'all 0.3s',
        zIndex: 1000 + props.layer,
        ...getControlTypeStyle(props),
    };
}

const ElementControl = (props) => {
    const { display } = useContext(ElementContext);
    const { item, color, address, className, connectDragSource } =
        props;

    const { showAddModal, onClickSettings, onRemove } =
        useContext(ElementContext);

    const handleRemove = useCallback(
        (event) => {
            event.preventDefault();
            onRemove(address);
        },
        [address, onRemove]
    );

    const handleOnClickEdit = useCallback(
        (event) => {
            event.preventDefault();
            onClickSettings(address);
        },
        [address, onClickSettings]
    );

    let hasPadding = false;

    const shouldShowGlobalContainerWidth =
        item.type === 'container' &&
        item.configuration?.globalWidth &&
        address.split('.').length === 3;

    const colSize = shouldShowGlobalContainerWidth
        ? 'Global'
        : getResponsiveValue({
              responsivePath: `media/${display}`,
              path:
                  item.type === 'container'
                      ? 'style/flexBasis'
                      : 'attr/__class__columnSize',
              data: item,
          })[1];

    if (item.style && item.style.padding) {
        const padding = new Map(item.style.padding);
        hasPadding = parseInt(padding.get('top')) > 26;
    }

    const patt = /^0\.?(?=[0-9])?0?$/;
    const isFirstSection = patt.test(address);
    let tooltipPlacement = isFirstSection
        ? isLeft(item._elType)
            ? 'bottom-right'
            : 'bottom'
        : isLeft(item._elType)
        ? 'top-right'
        : 'top';

    if (item.type === 'container' && address.startsWith('0.0')) {
        tooltipPlacement = 'bottom';
    }

    return (
        <>
            <Controls
                $elType={item.type}
                // hasPadding={hasPadding}
                style={getControlStyle(props)}
                className={`${prefix}-ec ${prefix}-element-control__controls ${className}`}
            >
                <ControlGroup color={color}>
                    {shouldRender.move(item) && (
                        <Tooltip
                            data-test="tooltip"
                            effect="hover"
                            placement={tooltipPlacement}
                            content={t(tooltipText[item._elType].move)}
                        >
                            {connectDragSource(
                                <div>
                                    <ActionButton
                                        // drag
                                        size="xs"
                                        type="none"
                                        onClick={(event) =>
                                            event.preventDefault()
                                        }
                                        color={color}
                                        icon={['far', 'arrows-alt']}
                                        data-testid={`drag-${item.type}-${props.address}`}
                                        className={`${prefix}-element-control__action-btn`}
                                    />
                                </div>
                            )}
                        </Tooltip>
                    )}
                    {shouldRender.size(item) && (
                        <Tooltip
                            effect="hover"
                            placement={tooltipPlacement}
                            content={t(renderType(item).colSize)}
                        >
                            <ActionButton
                                size={item.component_label ? 'xs' : 'sm'}
                                type="none"
                                color={color}
                                onClick={handleOnClickEdit}
                                className={`${prefix}-element-control__action-btn`}
                            >
                                {colSize}
                            </ActionButton>
                        </Tooltip>
                    )}
                    <Tooltip
                        effect="hover"
                        placement={tooltipPlacement}
                        content={t(tooltipText[item._elType].edit)}
                    >
                        <ActionButton
                            size={item.component_label ? 'xs' : 'sm'}
                            type="none"
                            color={color}
                            icon={['far', 'edit']}
                            onClick={handleOnClickEdit}
                            className={`${prefix}-element-control__action-btn`}
                        />
                    </Tooltip>
                    {shouldRender.delete(item) && (
                        <Tooltip
                            effect="hover"
                            placement={tooltipPlacement}
                            content={t(renderType(item).remove)}
                        >
                            <ActionButton
                                size={item.component_label ? 'xs' : 'sm'}
                                type="none"
                                color={color}
                                icon={['far', 'trash-alt']}
                                onClick={handleRemove}
                                className={`${prefix}-element-control__action-btn`}
                            />
                        </Tooltip>
                    )}
                    {shouldRender.add(item) && (
                        <Tooltip
                            effect="hover"
                            placement={tooltipPlacement}
                            content={t(tooltipText[item._elType].add)}
                        >
                            <ActionButton
                                // altBg
                                size="xs"
                                type="none"
                                color={color}
                                role="add-element"
                                icon={['far', 'plus']}
                                onClick={(event) => {
                                    showAddModal(item._elType, address);
                                    event.preventDefault();
                                }}
                                className={`${prefix}-element-control__action-btn`}
                            />
                        </Tooltip>
                    )}
                    {shouldRender.generateText(item) && (
                        <GenerateTextComp address={address} item={item} />
                    )}
                </ControlGroup>
            </Controls>
            {shouldRender.addColumn(item) && (
                <Controls
                    className={`${prefix}-ec ${prefix}-element-control__controls`}
                >
                    <Tooltip
                        className="add-new-column"
                        effect="hover"
                        placement="top"
                        content={t('Add New Column')}
                    >
                        <ActionButton
                            color={color}
                            icon={['far', 'plus']}
                            onClick={() => {
                                showAddModal(item._elType, address);
                            }}
                            className={`${prefix}-element-control__action-btn`}
                        />
                    </Tooltip>
                </Controls>
            )}
            {item._elType === 'SECTION' ? (
                <FooterControls
                    $elType={item._elType}
                    className={`${prefix}-ec ${prefix}-element-control__controls`}
                >
                    <Tooltip
                        effect="hover"
                        placement="top-left"
                        content={t('Add New Section')}
                    >
                        <ActionButton
                            color={color}
                            icon={['far', 'layer-plus']}
                            style={{
                                padding: '0 6px',
                            }}
                            onClick={(event) => {
                                event.preventDefault();
                                showAddModal(item._elType, address);
                            }}
                            className={`${prefix}-element-control__action-btn`}
                        >
                            {t('Add New Section')}
                        </ActionButton>
                    </Tooltip>
                </FooterControls>
            ) : null}
        </>
    );
};

export default memo(ElementControl);

function isLeft(elType) {
    return elType === 'SECTION' || elType === 'COLUMN';
}
