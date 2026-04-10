import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, InputNumber, Popover, Space, Typography } from 'antd';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import isArray from 'util/isArray';
import unitValue from 'util/unitValue';
import { isValidValue } from '../util';
import UnitInputStc from './UnitInput.stc';

const SelectAfter = ({
    allowedUnits,
    unit,
    defaultUnit,
    name,
    handleUnitChange,
}) => {
    const commonUnits = ['px', '%', 'em', 'rem'];
    const customUnits = isArray(allowedUnits) ? allowedUnits : [];
    const unitsBasedOnDefaultUnit = {
        px: [...commonUnits, ...customUnits, unit],
        '*': ['*', ...commonUnits, ...customUnits, unit],
        '%': /(width|height|maxWidth|maxHeight|max_width|max_height)$/i.test(
            name
        )
            ? [...commonUnits, ...customUnits, unit]
            : ['%', ...customUnits],
    }[defaultUnit] || [defaultUnit, ...customUnits, unit];

    const units = Array.from(new Set(unitsBasedOnDefaultUnit)).filter(Boolean);

    return (
        <Popover
            trigger={['hover']}
            placement="bottom"
            arrow={false}
            content={
                <Space direction="vertical" size={4} data-testid="unitSelect">
                    {units.map((allowedunit) => {
                        return (
                            <Button
                                key={allowedunit}
                                data-testid={`${allowedunit}-button`}
                                type={unit === allowedunit ? 'primary' : 'text'}
                                ghost={unit === allowedunit}
                                size="small"
                                block={true}
                                onClick={() => handleUnitChange(allowedunit)}
                            >
                                {allowedunit}
                            </Button>
                        );
                    })}
                </Space>
            }
            overlayInnerStyle={{
                padding: '4px',
            }}
        >
            <Button
                data-testid={`active-display-button`}
                type="link"
                size="small"
                className="unit-btn"
            >
                <>
                    {unit}
                    <br />
                    <FontAwesomeIcon
                        icon={icon({
                            name: 'chevron-down',
                            style: 'regular',
                        })}
                    />
                </>
            </Button>
        </Popover>
    );
};

const UnitInput = React.memo((props) => {
    const {
        name,
        value,
        prefix = '',
        min,
        max,
        step,
        width = 'inherit',
        inputType = '',
        inputTextAlign,
        onChange,
        inputDisable,
        placeholder = '',
        defaultUnit = '',
        defaultValue,
        allowedUnits = [],
        mqPlaceholder,
        mutateOnChange,
        label,
    } = props;
    const refunit = useRef(null);
    const defaultVal = value === undefined ? defaultValue : value;
    const [val, inputUnit, number = isValidValue(defaultVal) ? val : ''] =
        unitValue(defaultVal);
    let unit = inputUnit || defaultUnit;
    if (allowedUnits.length > 0 && !allowedUnits.includes(unit)) {
        unit = allowedUnits[0];
    }
    if (defaultVal) {
        refunit.current = unit;
    }

    const shouldRenderAddOnAfter =
        inputType.toLowerCase !== 'number' &&
        defaultUnit &&
        false !== allowedUnits &&
        allowedUnits[0] !== '';

    const handleChange = (value, currentUnit) => {
        const targetUnit = currentUnit ?? (refunit.current || unit);
        const input = {
            name,
            value:
                value !== null
                    ? value + (targetUnit === '*' ? '' : targetUnit)
                    : '',
        };
        typeof mutateOnChange === 'function'
            ? onChange(mutateOnChange(input))
            : onChange(input);
    };

    const handleUnitChange = (currentUnit) => {
        handleChange(number, currentUnit);
    };

    return (
        <UnitInputStc
            $inputTextAlign={inputTextAlign}
            $isPale={!!mqPlaceholder}
        >
            <InputNumber
                data-testid={label}
                className="inputNumber"
                size="small"
                step={step || 1}
                placeholder={placeholder}
                disabled={inputDisable}
                value={number}
                onChange={(value) => {
                    let payload =
                        value == undefined ? null : Number(value.toFixed(2));
                    handleChange(payload);
                }}
                onBlur={props.onBlur}
                onFocus={props.onFocus}
                style={{ width }}
                prefix={prefix}
                addonAfter={
                    shouldRenderAddOnAfter ? (
                        <SelectAfter
                            unit={refunit.current || unit}
                            defaultUnit={defaultUnit}
                            name={name}
                            allowedUnits={allowedUnits}
                            handleUnitChange={handleUnitChange}
                        />
                    ) : null
                }
            />
        </UnitInputStc>
    );
});

export const LabeledUnitInput = ({
    label,
    prefix,
    onChange,
    labelWidth,
    labelPosition,
    inputTextAlign = 'right',
    ...restOfProps
}) => {
    const { t } = useTranslation();
    const iconProps = {
        'text-height': {
            icon: icon({
                name: 'text-height',
                style: 'regular',
            }),
        },
        'text-width': {
            icon: icon({
                name: 'text-width',
                style: 'regular',
            }),
        },
    }[prefix];
    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Typography.Text>{t(label)}</Typography.Text>
            <UnitInput
                {...restOfProps}
                inputTextAlign={inputTextAlign}
                onChange={onChange}
                {...(!!prefix && {
                    prefix: (
                        <FontAwesomeIcon
                            {...iconProps}
                            data-testid={`${prefix}-icon`}
                            style={{
                                color: '#a2a1b7',
                            }}
                        />
                    ),
                })}
            />
        </Space>
    );
};

export default UnitInput;
