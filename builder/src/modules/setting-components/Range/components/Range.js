import throttle from 'lodash/throttle';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

/*****************************************************
 * Packages
 ******************************************************/
import { Col, Row, Slider } from 'antd';
/*****************************************************
 * Local
 ******************************************************/
import { Overlay } from 'modules/Shared/Overlay';
import RenderComponentWithLabel from 'modules/Shared/settings-components/RenderComponentWithLabel';
import UnitInput from 'modules/Shared/settings-components/UnitInput';
import { isValidValue } from 'modules/Shared/util';
import unitValue from 'util/unitValue';

const getFormattedValue = (value, savedUnit, currentUnit) => {
    return (value ?? 0) + (savedUnit || currentUnit);
};

const RangeStc = styled.div`
    .ant-slider-track {
        left: -3% !important;
    }
`;

const Range = (props) => {
    const {
        module: {
            min,
            max,
            step = 1,
            defaultUnit = '',
            defaultValue,
            allowedUnits,
        } = props,
        name,
        value,
        placeholder = '',
        onChange,
    } = props;

    const targetValue = value === undefined ? defaultValue : value;
    const [currentValue, setCurrentValue] = useState(targetValue);
    const [dragging, setDragging] = useState(false);
    const refunit = useRef(null);

    const [val, inputUnit] = unitValue(currentValue);
    const number = isValidValue(currentValue)
        ? Math.min(Math.max(val, min || -Infinity), max || +Infinity)
        : '';

    let unit = inputUnit || defaultUnit || '';
    if (allowedUnits && !allowedUnits.includes(unit)) {
        unit = allowedUnits[0];
    }
    if (currentValue) {
        refunit.current = unit;
    }

    const handleChange = useCallback(
        ({ value: newValue }) => {
            setCurrentValue(newValue);
            onChange({ name, value: newValue });
        },
        [onChange, name]
    );

    const throttledHandleChange = useCallback(
        throttle(onChange, 0, { leading: true, trailing: true }),
        [handleChange]
    );

    const handleSlider = (value) => {
        setDragging(true);
        const newValue = getFormattedValue(value, refunit.current, unit);
        setCurrentValue(newValue);
        throttledHandleChange({ name, value: newValue });
    };

    const copyModule = { ...props.module };
    delete copyModule.labelPosition;

    useEffect(() => {
        if (currentValue !== targetValue && !dragging) {
            setCurrentValue(targetValue);
        }
    }, [targetValue, currentValue, dragging]);

    return (
        <RenderComponentWithLabel {...props} module={copyModule}>
            <RangeStc>
                <Row gutter={14} align={'middle'}>
                    <Col flex={1}>
                        <Slider
                            max={max}
                            min={min}
                            step={step || 1}
                            onChange={handleSlider}
                            onChangeComplete={() => setDragging(false)}
                            value={number}
                            tooltip={{
                                formatter: () => {
                                    if ('' === number) {
                                        return placeholder;
                                    }
                                    return `${number}${unit}`;
                                },
                            }}
                        />
                    </Col>
                    <Col>
                        <UnitInput
                            {...props}
                            width="70px"
                            name={name}
                            value={currentValue}
                            onChange={handleChange}
                        />
                    </Col>
                </Row>
            </RangeStc>
            {dragging && <Overlay mask />}
        </RenderComponentWithLabel>
    );
};
export default memo(Range);
