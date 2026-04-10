/*****************************************************
 * Packages
 ******************************************************/
import React, { useState, useContext } from 'react';
import styled, { css } from 'styled-components';

/*****************************************************
 * Locals
 ******************************************************/
import { ThemeContext } from 'styled-components';
import Button from '../other-components/Button';
import InputGroup from './InputGroup';
import UnitInput from './UnitInput';

/*****************************************************
 * Styles
 ******************************************************/
const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;
const InputCol = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;
const PreviewCol = styled.div`
    display: flex;
    width: 100%;
    max-width: 65px;
    height: 65px;
    margin: 0 6px;
    align-items: center;
    justify-content: center;
    border: 2px solid ${({ theme }) => theme.primary.fg};
`;

function activeCorner({ theme, position = 'top-left' }) {
    const [b1, b2] = position.split('-');
    return css`
        border-${position}-radius: 10px;
        border-${b2}-color: ${({ theme }) => theme.titleText};
        border-${b1}-color: ${({ theme }) => theme.titleText};
    `;
}
const Rect = styled.span`
    height: 20px;
    width: 20px;
    background: ${({ theme }) => theme.inputBg};
    border: 2px solid ${({ theme }) => theme.inputBorder};
    ${activeCorner}
`;

const BorderRadius = ({ name, value, onChange, mqValue, mqEnabled }) => {
    // assign default value
    value = !value ? `0px 0px 0px 0px` : value;
    mqValue = !mqValue ? value : mqValue;
    const { primary } = useContext(ThemeContext);

    const [locked, setLock] = useState(false);
    const [lastChanged, setLastChanged] = useState();
    const [topLeft, topRight, bottomRight, bottomLeft] = value
        .split(' ')
        .map((val) => val || '0px');
    const state = { topLeft, topRight, bottomRight, bottomLeft };

    const handleLock = () => {
        if (!locked && lastChanged) {
            const newState = {
                topLeft: lastChanged,
                topRight: lastChanged,
                bottomRight: lastChanged,
                bottomLeft: lastChanged,
            };
            onChange({
                name,
                value: Object.values(newState).join(' '),
            });
        }
        setLock(!locked);
    };

    const handleChange = (payload) => {
        const { value, name: inputName } = payload;
        setLastChanged(value);
        let newState = state;
        if (locked) {
            newState = {
                topLeft: value,
                topRight: value,
                bottomLeft: value,
                bottomRight: value,
            };
        } else {
            newState = {
                ...state,
                [inputName]: value,
            };
        }
        onChange({ name, value: Object.values(newState).join(' ') });
    };

    return (
        <Wrapper>
            <InputCol>
                <InputGroup
                    labelWidth="40px"
                    label={<Rect position="top-left" />}
                >
                    <UnitInput
                        width="50px"
                        type="numeric"
                        name="topLeft"
                        defaultUnit="px"
                        value={state.topLeft}
                        onChange={handleChange}
                    />
                </InputGroup>
                <InputGroup
                    labelWidth="40px"
                    label={<Rect position="bottom-left" />}
                >
                    <UnitInput
                        width="50px"
                        type="numeric"
                        defaultUnit="px"
                        name="bottomLeft"
                        value={state.bottomLeft}
                        onChange={handleChange}
                    />
                </InputGroup>
            </InputCol>

            <PreviewCol style={{ borderRadius: value }}>
                <Button
                    type="none"
                    btnType="button"
                    onClick={handleLock}
                    icon={['far', 'lock-alt']}
                    style={{ color: locked ? primary.fg : '' }}
                />
            </PreviewCol>

            <InputCol>
                <InputGroup
                    labelAlt
                    labelWidth="40px"
                    label={<Rect position="top-right" />}
                >
                    <UnitInput
                        width="50px"
                        type="numeric"
                        defaultUnit="px"
                        name="topRight"
                        value={state.topRight}
                        onChange={handleChange}
                    />
                </InputGroup>
                <InputGroup
                    labelAlt
                    labelWidth="40px"
                    label={<Rect position="bottom-right" />}
                >
                    <UnitInput
                        width="50px"
                        type="numeric"
                        defaultUnit="px"
                        name="bottomRight"
                        value={state.bottomRight}
                        onChange={handleChange}
                    />
                </InputGroup>
            </InputCol>
        </Wrapper>
    );
};
export default BorderRadius;
