import styled from 'styled-components';
import { inputField } from './reusable/shared-styles';

/*****************************************************
 * Styles
 ******************************************************/
export const SelectWrap = styled.div`
    position: relative;
`;
export const SelectEl = styled.div`
    display: ${({ isHidden }) => (isHidden ? 'none' : 'flex')};
    justify-content: space-between;
    align-items: center;
    position: relative;
    cursor: pointer;
    ${inputField}
    /* should be after inputField */
    ${({ isExpended }) =>
        isExpended &&
        `border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
        border-bottom: 0;`}

    .select-arrow {
        position: absolute;
        right: 15px;
    }
`;

export const OptionEl = styled.li`
    color: ${({ theme, isActive }) =>
        isActive ? theme.primary.fg : theme.bodyText};
    padding: 0 15px 0 38px;
    align-items: center;
    position: relative;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    height: 32px;

    .icon {
        position: absolute;
        left: 15px;
    }

    &:last-child {
        border-radius: 0 0 5px 5px;
    }

    &:hover {
        background-color: ${({ theme }) => theme.primary.fg};
        color: ${({ theme }) => theme.primary.bg};
    }
`;

export const OptionWrap = styled.ul`
    border: 1px solid ${({ theme }) => theme.inputBorder};
    background: ${({ theme }) => theme.primary.bg};
    border-radius: 0 0 5px 5px;
    position: absolute;
    list-style: none;
    width: 100%;
    padding: 0;
    z-index: 1;
    top: 100%;
    margin: 0;
`;

export const SelectNative = styled.select`
    ${inputField}
    height: 32px;
    width: 100%;

    &:focus {
        outline: 0;
        border-color: #80bdff;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25) inset;
    }
`;
