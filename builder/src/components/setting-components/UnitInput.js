import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import unitValue from '../../util/unitValue';
import InputGroup from './InputGroup';
import { InputWrap, Input, NumberControls } from './UnitInput.stc';

const UnitInput = React.memo((props) => {
    const {
        type,
        name,
        value,
        width,
        inputId,
        onChange,
        inputDisable,
        isSidebar,
        placeholder,
        defaultUnit,
        defaultValue = '',
        allowedUnits,
        mqPlaceholder,
        mutateOnChange,
    } = props;
    const defaultVal = value === undefined ? defaultValue : value;
    // TODO: start increment from min value
    // TODO: should not exceed max value
    const withArrows = type === 'numeric';
    const inputType = withArrows || !type ? 'text' : type;
    const className = `${withArrows ? 'form-control--with-arrow' : ''}`;
    let unitType = '';
    if (defaultUnit) {
        unitType = defaultUnit;
    }

    const getUnit = (inputUnit) => {
        const unit = inputUnit || unitType;
        if (!allowedUnits) return unit;
        return allowedUnits.includes(unit) ? unit : allowedUnits[0];
    };

    const handleChange = (value) => {
        const input = { name, value };
        typeof mutateOnChange === 'function'
            ? onChange(mutateOnChange(input))
            : onChange(input);
    };

    const increment = () => {
        const [num, unit] = unitValue(value);
        const newValue = `${num + 1}${getUnit(unit)}`;
        handleChange(newValue);
    };
    const decrement = () => {
        const [num, unit] = unitValue(value);
        const newValue = `${num - 1}${getUnit(unit)}`;
        handleChange(newValue);
    };

    const handleBlur = (value) => {
        const [num, inpUnit] = unitValue(value);
        if (value && defaultUnit && !inpUnit) {
            const newValue = `${num}${getUnit(inpUnit)}`;
            handleChange(newValue);
        } else if (
            value &&
            inpUnit &&
            allowedUnits &&
            !allowedUnits.includes(inpUnit)
        ) {
            const newValue = `${num}${getUnit(inpUnit)}`;
            handleChange(newValue);
        }
    };

    const handleKeyDown = (e) => {
        const keyCode = e.keyCode;
        if (keyCode === 38) {
            e.preventDefault();
            increment();
        } else if (keyCode === 40) {
            e.preventDefault();
            decrement();
        }
    };

    return (
        <InputWrap width={width} isSidebar={isSidebar}>
            <Input
                disabled={inputDisable}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={(e) => handleBlur(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                isPale={!!mqPlaceholder}
                className={className}
                isSidebar={isSidebar}
                value={defaultVal}
                type={inputType}
                id={inputId}
            />

            <NumberControls className="number-control">
                <button onClick={increment}>
                    <FontAwesomeIcon icon="chevron-up" />
                </button>
                <button onClick={decrement}>
                    <FontAwesomeIcon icon="chevron-down" />
                </button>
            </NumberControls>
        </InputWrap>
    );
});

export const LabeledUnitInput = ({
    label,
    onChange,
    labelWidth,
    labelPosition,
    ...restOfProps
}) => {
    let labelOptions;
    if (labelPosition === 'inline' && label) {
        labelOptions = { label, labelWidth };
    }
    return (
        <InputGroup {...labelOptions} {...restOfProps}>
            <UnitInput {...restOfProps} onChange={onChange} />
        </InputGroup>
    );
};

export default UnitInput;
