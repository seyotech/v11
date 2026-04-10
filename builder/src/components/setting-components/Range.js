/*****************************************************
 * Packages
 ******************************************************/
import React from 'react';

/*****************************************************
 * Local
 ******************************************************/
import RangeSlider from './Range/RangeSlider';
import unitValue from '../../util/unitValue';
import InputGroup from './InputGroup';
import UnitInput from './UnitInput';

const rangeStyle = { flex: 1 };

/**
 * @typedef {Object} Props
 * @property {number} [min]
 * @property {number} [max]
 * @property {string} name
 * @property {number} value
 * @property {function} onChange
 * @property {string} [labelWidth]
 * @property {string} [defaultUnit]
 * @property {number} [defaultValue]
 * @property {string[]} [allowedUnits]
 * @property {string} [labelPosition]
 *
 * @param {Props} param0
 */
const Range = ({
    min,
    max,
    step,
    name,
    style,
    label,
    value,
    onChange,
    isSidebar,
    labelWidth,
    defaultUnit,
    inputDisable,
    placeholder,
    defaultValue,
    allowedUnits,
    labelPosition,
    mqPlaceholder,
    mutateOnChange,
}) => {
    const defaultVal = value === undefined ? defaultValue : value;
    const handleChange = (payload) => {
        onChange({ name, value: payload.value });
    };

    let labelOptions;
    if (labelPosition === 'inline' && label) {
        labelOptions = { label, labelWidth, isSidebar };
    }

    return (
        <InputGroup {...labelOptions} style={style}>
            <RangeSlider
                allowedUnits={allowedUnits}
                defaultUnit={defaultUnit}
                onChange={handleChange}
                isSidebar={isSidebar}
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
                isSidebar={isSidebar}
                onChange={handleChange}
                inputDisable={inputDisable}
                type="numeric"
                value={defaultVal}
                name="range"
                width="50px"
                mutateOnChange={mutateOnChange}
            />
        </InputGroup>
    );
};
export default React.memo(Range);
