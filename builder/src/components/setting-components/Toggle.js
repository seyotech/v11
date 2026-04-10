import styled from 'styled-components';
import React from 'react';
import Label from './Label/Label';

const ToogleSC = styled.div`
    transition: all 0.2s;
    position: relative;
    cursor: pointer;
    width: 85px;

    &.active {
        background-color: var(--blue);
        color: #fff;
        &:after {
            visibility: hidden;
            opacity: 0;
        }
        &:before {
            visibility: visible;
            opacity: 1;
        }

        .toggle-handle {
            left: calc(100% - 35px);
        }
    }

    &:before,
    &:after {
        line-height: var(--input-height);
        height: var(--input-height);
        position: absolute;
    }

    &:before {
        visibility: hidden;
        opacity: 0;
        content: 'ON';
        left: 10px;
    }
    &:after {
        visibility: visible;
        opacity: 1;
        content: 'OFF';
        right: 10px;
    }
`;

const Handle = styled.span`
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    display: inline-block;
    transition: all 0.2s;
    border-radius: 5px;
    position: absolute;
    height: 30px;
    width: 30px;
    left: 5px;
    top: 5px;
`;

const Toggle = (props) => {
    const { label, value, onClick } = props;
    return (
        <>
            {label && <Label>{label}</Label>}
            <ToogleSC
                onClick={onClick}
                isActive={value}
                className={`input-default ${value ? 'active' : ''}`}
            >
                <Handle className="toggle-handle" />
            </ToogleSC>
        </>
    );
};
export default Toggle;
