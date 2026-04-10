import { useState, useContext } from 'react';
import { ElementContext } from 'contexts/ElementRenderContext';
import { DnDElementContext } from 'modules/CanvasElementRenderer/context/DnDElementContext';
import SingleSpacing from './SingleSpacing';
import unitValue from 'util/unitValue';
import {
    spacingTypeEnum,
    directions,
    spacingTypes,
} from '../../constants/spacingEnum';

const getPayload = ({ styles, direction, value, isLocked }) => {
    const [number, inputUnit] = unitValue(value || '');
    const updatedValue = `${parseFloat(
        !isNaN(number) ? number : 0
    )}${inputUnit}`;
    const copyMap = new Map([...styles]);
    if (isLocked) {
        directions.forEach((dir) => {
            copyMap.set(dir, updatedValue);
        });
        return Array.from(copyMap);
    }
    copyMap.set(direction, updatedValue);
    return Array.from(copyMap);
};

const SpacingBoundaries = ({ address, item }) => {
    const { onSaveSettings } = useContext(ElementContext);
    const { focusedAddress, isDraggingBoundary } =
        useContext(DnDElementContext);
    const [lockStates, setLockStates] = useState({});
    const [lastChanged, setLastChanged] = useState({});
    const [
        currentlyVisibleControlBoundary,
        setCurrentlyVisibleControlBoundary,
    ] = useState(null);

    const handleSpaceBoundaryVisibility = (value = false) => {
        setCurrentlyVisibleControlBoundary(value);
    };

    const handleLock = ({ type, direction, isLocked, path, styles }) => {
        const value = lastChanged[type];
        setLockStates((prev) => ({
            ...prev,
            [type]: !prev[type],
        }));
        isLocked &&
            value &&
            handleChange({
                type,
                direction,
                isLocked,
                value,
                path,
                styles,
            });
    };

    const handleChange = ({
        type,
        direction,
        path,
        styles,
        isLocked,
        value,
    }) => {
        setLastChanged((prev) => ({
            ...prev,
            [type]: value,
        }));
        onSaveSettings(
            {
                name: path,
                value: getPayload({
                    styles,
                    direction,
                    isLocked,
                    value,
                }),
            },
            address
        );
    };

    if (focusedAddress !== address) {
        return null;
    }

    return directions.map((direction) =>
        spacingTypes.map((type) => {
            const key = `${address}-${type}-${direction}`;
            const isLocked = lockStates[type];
            const forceVisible =
                isLocked &&
                (currentlyVisibleControlBoundary || '').includes(type);
            if (
                ![null, key].includes(currentlyVisibleControlBoundary) &&
                type !== spacingTypeEnum.MARGIN &&
                !forceVisible
            ) {
                return null;
            }
            return (
                <SingleSpacing
                    key={key}
                    direction={direction}
                    type={type}
                    address={address}
                    item={item}
                    isLocked={isLocked}
                    forceVisible={forceVisible}
                    currentlyVisibleControlBoundary={
                        currentlyVisibleControlBoundary
                    }
                    handleChange={handleChange}
                    handleLock={handleLock}
                    handleSpaceBoundaryVisibility={
                        handleSpaceBoundaryVisibility
                    }
                />
            );
        })
    );
};

export default SpacingBoundaries;
