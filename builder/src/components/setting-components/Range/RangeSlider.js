import React from 'react';
import styled from 'styled-components';
import unitValue from '../../../util/unitValue';
import './style.scss';

export const Slider = styled.div`
    width: 100%;
    padding: 0 10px;
    border-radius: 5px;
    position: relative;
    border: 1px solid ${({ theme }) => theme.inputBorder};
    height: ${({ isSidebar }) => (isSidebar ? '26px' : '32px')};
`;

const RangeSlider = ({
    max,
    min,
    step,
    value,
    theme,
    onChange,
    isSidebar,
    defaultUnit,
    allowedUnits,
}) => {
    const [val] = unitValue(value);
    const unit = allowedUnits
        ? allowedUnits[0]
        : defaultUnit
        ? defaultUnit
        : '';

    const handleChange = (event) => {
        const { name, value } = event.target;
        onChange({ name, value: value + unit });
    };
    return (
        <Slider
            className="--dorik--slider-component"
            isSidebar={isSidebar}
            theme={theme}
        >
            <input
                min={min}
                max={max}
                value={val}
                step={step}
                type="range"
                onChange={handleChange}
            />
        </Slider>
    );
};
export default React.memo(RangeSlider);
