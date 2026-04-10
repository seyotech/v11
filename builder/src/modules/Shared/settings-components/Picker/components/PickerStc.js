import styled, { createGlobalStyle } from 'styled-components';

export const PickerGlobalStc = createGlobalStyle`
    .ant-select-item-option[title='HSB'] {
        display: none;
    }

    .ant-color-picker-inner {
        width: 234px;
    }
`;

export const PickerStc = styled.div`
    ${({ $isLabelpositionInline, $isGlobal }) => {
        return !$isLabelpositionInline && !$isGlobal
            ? { width: '100%' }
            : { width: '90px' };
    }}
    height: 24px;
    display: flex;
    padding: 2px 4px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    & input {
        padding: 0;
        border: none;
        font-size: 13px;
        margin-left: 4px;
        &:focus {
            border: none;
            outline: none;
            box-shadow: none;
        }
    }
`;

export const ActiveGlobal = styled.div`
    width: 32px;
    height: 32px;
    margin-top: 4px;
    border-radius: 5px;
    background-color: ${({ bg }) => bg};
`;
