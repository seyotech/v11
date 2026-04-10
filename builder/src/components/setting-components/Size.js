import React from 'react';
import InputGroup from './InputGroup';
import RangeSlider from './Range/RangeSlider';
import UnitInput from './UnitInput';

const rangeStyle = { flex: 1 };

const Size = ({
    min,
    max,
    step,
    name,
    style,
    label,
    value,
    onChange,
    labelWidth,
    defaultUnit,
    placeholder,
    defaultValue,
    allowedUnits,
    labelPosition,
    mqPlaceholder,
    times,
}) => {
    const defaultVal = value === undefined ? defaultValue.height : value.height;
    const handleChange = (payload) => {
        onChange({
            name,
            value: {
                height: payload.value,
                width: `${parseInt(payload.value) * times}px`,
                'min-width': `${parseInt(payload.value) * times}px`,
            },
        });
    };

    let labelOptions;
    if (labelPosition === 'inline' && label) {
        labelOptions = { label, labelWidth };
    }
    return (
        <InputGroup {...labelOptions} style={style}>
            <RangeSlider
                allowedUnits={allowedUnits}
                defaultUnit={defaultUnit}
                onChange={handleChange}
                style={rangeStyle}
                value={defaultVal}
                step={step}
                max={max}
                min={min}
            />
            <UnitInput
                mqPlaceholder={mqPlaceholder}
                allowedUnits={allowedUnits}
                placeholder={placeholder}
                defaultUnit={defaultUnit}
                onChange={handleChange}
                type="numeric"
                value={defaultVal}
                name="range"
                width="85px"
            />
        </InputGroup>
    );
};

export default Size;
