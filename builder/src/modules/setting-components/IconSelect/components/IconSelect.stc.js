import styled from 'styled-components';
import { antToken } from '../../../../antd.theme';
const IconPackStc = {};

export const Wrapper = styled.div`
    border-radius: 6px;
    border: 1px solid #f0f0f0;
`;

export const Search = styled.div`
    color: #0c0a25;
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    position: relative;

    & input {
        width: 100%;
        height: 30px;
        border: none;
        padding: 4px 8px;
        background: #f4f6f9;
        border-radius: 6px 6px 0px 0px;
        border-bottom: 1px solid #f0f0f0;
    }

    & svg {
        top: 10px;
        right: 8px;
        cursor: pointer;
        position: absolute;
    }
`;

export const IconStc = styled.div`
    display: flex;
    cursor: pointer;
    border-radius: 5px;
    align-items: center;
    justify-content: center;
    color: ${({ isSelected, theme }) => isSelected && theme.primary.bg};
    background: ${({ theme, isSelected }) => isSelected && theme.primary.fg};

    & svg {
        color: ${({ isSelected }) =>
            isSelected ? 'inherit' : antToken.colorTextHeading};
    }
`;

export default IconPackStc;
