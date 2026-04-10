import { useState, useEffect, useContext } from 'react';
import { ElementContext } from 'contexts/ElementRenderContext';
import { DnDElementContext } from 'modules/CanvasElementRenderer/context/DnDElementContext';
import { useDrag } from 'react-dnd';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SpacingBoundary, MarginExtra } from './SingleSpacing.stc';
import { getEmptyImage } from 'react-dnd-html5-backend';
import throttle from 'lodash/throttle';
import unitValue from 'util/unitValue';
import { getResponsiveValue } from 'modules/Shared/util/getConditionalPathAndValue';
import { directionEnum, spacingTypeEnum } from '../../constants/spacingEnum';

const extractStyleValue = ({ styles, direction }) => {
    if (styles) {
        const foundStyle = styles.find(([dir]) => dir === direction);
        return unitValue(foundStyle ? foundStyle[1] : null);
    }

    return [];
};

const getIconProps = (isLocked) => {
    return isLocked
        ? {
              icon: icon({
                  name: 'lock',
                  style: 'solid',
              }),
              style: { color: '#000000', fontSize: '12px' },
          }
        : {
              icon: icon({
                  name: 'lock',
                  style: 'regular',
              }),
              style: { color: '#000000', fontSize: '12px' },
          };
};

function SingleSpacing({
    address,
    type,
    direction,
    item,
    isLocked,
    forceVisible,
    currentlyVisibleControlBoundary,
    handleLock,
    handleChange,
    handleSpaceBoundaryVisibility,
}) {
    const { display } = useContext(ElementContext);
    const { isDraggingBoundary, setIsDraggingBoundary } =
        useContext(DnDElementContext);
    let path = `style/${type}`,
        styles;
    if (display !== 'desktop') {
        [path, styles] = getResponsiveValue({
            responsivePath: `media/${display}`,
            path,
            data: item,
        });
        styles = Array.isArray(styles) ? styles : [];
    } else {
        styles = { ...item?.style }[type] || [];
    }
    const key = `${address}-${type}-${direction}`;
    const [initialNumber, inputUnit, unit = inputUnit || 'px'] =
        extractStyleValue({
            styles,
            direction,
        });
    const [startCoords, setStartCoords] = useState(null);
    const [number, setValue] = useState(initialNumber);
    const [{ isDragging }, drag, preview] = useDrag({
        type: `${address}-${type}-${direction}`,
        collect: (monitor) => {
            return {
                isDragging: monitor.isDragging(),
            };
        },
    });
    if (!isDragging && isLocked && initialNumber !== number) {
        setValue(initialNumber);
    }

    const handleDragStart = (e) => {
        setIsDraggingBoundary(true);
        setStartCoords({ x: e.clientX, y: e.clientY });
    };

    const handleDragEnd = (e) => {
        setIsDraggingBoundary(false);
        setStartCoords(null);
    };

    const handleDrag = throttle(
        ({ e, isDragging, startCoords }) => {
            if (startCoords && isDragging && e.clientX >= 0 && e.clientY >= 0) {
                let movementX = e.clientX - startCoords.x;
                let movementY = e.clientY - startCoords.y;
                if (
                    [directionEnum.TOP, directionEnum.BOTTOM].includes(
                        direction
                    )
                ) {
                    setValue((prev) => {
                        const updatedValue = (prev || 0) + movementY;
                        if (
                            type === spacingTypeEnum.PADDING &&
                            updatedValue < 0
                        ) {
                            return prev;
                        }
                        return updatedValue;
                    });
                }
                if (
                    [directionEnum.LEFT, directionEnum.RIGHT].includes(
                        direction
                    )
                ) {
                    setValue((prev) => {
                        const updatedValue = (prev || 0) + movementX;
                        if (
                            type === spacingTypeEnum.PADDING &&
                            updatedValue < 0
                        ) {
                            return prev;
                        }
                        return updatedValue;
                    });
                }
                setStartCoords({ x: e.clientX, y: e.clientY });
            }
        },
        20,
        { leading: false }
    );

    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true });
        return () => {
            setIsDraggingBoundary(false);
        };
    }, []);

    useEffect(() => {
        if (isDragging) {
            const value = `${number}${unit}`;
            currentlyVisibleControlBoundary !== key &&
                handleSpaceBoundaryVisibility(key);
            handleChange({
                type,
                direction,
                isLocked,
                value,
                path,
                styles,
            });
        }
    }, [isDragging, number, currentlyVisibleControlBoundary, key]);

    const isHovered = currentlyVisibleControlBoundary === key;

    return (
        <>
            {(!(type == spacingTypeEnum.MARGIN && number < 0) || isHovered) && (
                <SpacingBoundary
                    ref={drag}
                    address={address}
                    $isDragging={isDragging}
                    $isHovered={isHovered}
                    forceVisible={forceVisible}
                    direction={direction}
                    type={type}
                    number={number}
                    unit={unit}
                    onDragStart={handleDragStart}
                    onDrag={(e) => {
                        handleDrag({ e, isDragging, startCoords });
                    }}
                    onDragEnd={handleDragEnd}
                    onMouseEnter={(e) => {
                        e.stopPropagation();
                        !isDraggingBoundary &&
                            handleSpaceBoundaryVisibility(key);
                    }}
                    onMouseLeave={() => {
                        !isDraggingBoundary &&
                            handleSpaceBoundaryVisibility(null);
                    }}
                >
                    <div className="content">
                        {!isNaN(number) && (
                            <span style={{ fontSize: '12px', color: 'black' }}>
                                {`${number}${unit}`}
                            </span>
                        )}
                        {number > 10 && (
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleLock({
                                        type,
                                        direction,
                                        isLocked: !isLocked,
                                        path,
                                        styles,
                                    });
                                }}
                                style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center ',
                                }}
                            >
                                <FontAwesomeIcon
                                    data-testid="lock-icon"
                                    {...getIconProps(isLocked)}
                                />
                            </span>
                        )}
                    </div>
                </SpacingBoundary>
            )}
            {type === spacingTypeEnum.MARGIN && number < 0 && (
                <MarginExtra
                    address={address}
                    direction={direction}
                    type={spacingTypeEnum.MARGIN}
                    number={number}
                    unit={unit}
                    onMouseEnter={(e) => {
                        e.stopPropagation();
                        handleSpaceBoundaryVisibility(key);
                    }}
                />
            )}
        </>
    );
}

export default SingleSpacing;
