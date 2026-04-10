import { useCallback, useState } from 'react';
import { Button, ColorPicker, Input } from 'antd';
import throttle from 'lodash/throttle';
import { useTranslation } from 'react-i18next';

import useGlobals from 'hooks/useGlobals';
import { Overlay } from 'modules/Shared/Overlay';
import { ActiveGlobal, PickerGlobalStc, PickerStc } from './PickerStc';

const colorVarRegex = /--color-\d+/gm;
const getGlobalColor = ({ colors, colorVar }) => {
    const [key] = colorVar.match(colorVarRegex) || [];
    if (!key) return;

    const foundColor = colors.find((color) => color.key === key);

    return foundColor?.value;
};

/**
 * @component
 * @param {Object} props - The component's props.
 * @param {string|number} props.name - path or index of the color item.
 * @param {string} props.value - value of the color item.
 * @param {string} props.placeholder
 * @param {string} props.defaultValue
 * @param {function} props.onChange - to set new color
 * @param {Boolean} props.isLabelpositionInline - is picker label inline with picker
 * @param {Boolean} props.isGlobal - is picker global
 *
 * @returns {JSX.Element}
 */

const Picker = ({
    name,
    value,
    onChange,
    placeholder = 'eg: #ff00ff',
    defaultValue,
    isGlobal = false,
    isLabelpositionInline,
}) => {
    const activeValue = value || defaultValue;
    const { colors, setColors } = useGlobals();
    const [dragging, setDragging] = useState(false);
    const [color, setColor] = useState(activeValue);
    const { t } = useTranslation('builder');
    const isAddedToGlobal = colors.some((color) => color.value === value);

    const getItemNum = (item) => {
        if (typeof item?.key !== 'string') return 0;
        const number = item.key.split('-').slice(-1).pop();
        return Number(number);
    };

    const addToGlobal = (value) => {
        const copied = colors ? [...colors] : [];
        const [lastItem] = copied.slice(-1);
        const num = getItemNum(lastItem);
        copied.push({ value, key: `--color-${num + 1}` });
        setColors(copied);
    };

    const handleChange = useCallback(
        (color) => {
            const hexReg = /#?[0-9a-fA-F]{6}/;
            if (hexReg.test(color)) {
                color = color.startsWith('#') ? color : `#${color}`;
            }
            onChange({ name, value: color });
        },
        [name, onChange]
    );

    const throttledHandleChange = useCallback(
        throttle(handleChange, 0, { leading: true, trailing: true }),
        [handleChange]
    );

    const handleColorPicker = (color, hex) => {
        setDragging(true);
        setColor(color);
        throttledHandleChange(hex);
    };

    const handlePickerOpen = (isOpen) => {
        if (!isOpen || !value) return;

        const currentValue = colorVarRegex.test(value)
            ? getGlobalColor({ colors, colorVar: value })
            : value;

        const currentColor =
            typeof color === 'string' ? color : color?.toHexString();

        if (currentColor !== currentValue) {
            setColor(currentValue);
        }
    };

    return (
        <>
            <PickerGlobalStc />
            <ColorPicker
                value={color}
                onChange={handleColorPicker}
                onOpenChange={handlePickerOpen}
                onChangeComplete={() => setDragging(false)}
                panelRender={(_, { components: { Picker } }) => (
                    <>
                        <Picker />

                        {isAddedToGlobal && <ActiveGlobal bg={value} />}

                        <Button
                            type="dashed"
                            block
                            style={{ marginTop: 8 }}
                            disabled={isAddedToGlobal}
                            onClick={() => addToGlobal(value)}
                        >
                            {isAddedToGlobal
                                ? t('Added')
                                : t('Add To Global Color')}
                        </Button>
                    </>
                )}
            >
                <PickerStc
                    $isLabelpositionInline={isLabelpositionInline}
                    $isGlobal={isGlobal}
                >
                    <Button
                        data-testid="colorPickerButton"
                        shape="round"
                        size="small"
                        style={{
                            height: 16,
                            padding: '8px',
                            background: activeValue,
                        }}
                    />
                    <Input
                        value={activeValue}
                        placeholder={placeholder}
                        onChange={(event) => handleChange(event.target.value)}
                    />
                </PickerStc>
            </ColorPicker>
            {dragging && <Overlay mask />}
        </>
    );
};

export default Picker;
