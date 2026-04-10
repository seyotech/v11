import styled from 'styled-components';
import { inputField } from '../setting-components/reusable/shared-styles';

export const Input = styled.input`
    width: 100%;
    ${inputField}
    margin-bottom: 15px;

    &::-webkit-calendar-picker-indicator {
        display: none;
    }
`;

export const Wrap = styled.div`
    position: relative;
`;
export const Close = styled.span`
    top: 12px;
    right: 12px;
    font-size: 14px;
    cursor: pointer;
    position: absolute;
`;
