import styled, { css } from 'styled-components';

export const Title = styled.div`
    color: #fff;
    width: 100%;
    height: 36px;
    display: flex;
    font-size: 14px;
    margin-top: -8px;
    font-weight: 500;
    text-align: center;
    margin-bottom: 5px;
    background: #2b3556;
    align-items: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-pack: center;
    border-radius: 2px 2px 0 0;
    -webkit-justify-content: center;
    & span {
        display: inline-block;
        width: 100px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
`;
const Menu = styled.div`
    top: 0;
    left: 0;
    z-index: -1;
    display: flex;
    position: fixed;
    padding: 8px 0px;
    border-radius: 2px;
    background: #ffffff;
    white-space: nowrap;
    flex-direction: column;
    align-items: flex-start;
    box-shadow: 0px 3px 6px -4px rgba(0, 0, 0, 0.12),
        0px 6px 16px rgba(0, 0, 0, 0.08), 0px 9px 28px 8px rgba(0, 0, 0, 0.05);
    width: 200px;
`;

export const NestedMenu = styled.div`
    display: none;
    position: absolute;
    top: 0;
    left: 100%;
    min-width: 180px;
    padding: 8px 0px;
    border-radius: 2px;
    background: #ffffff;
    white-space: nowrap;
    flex-direction: column;
    align-items: flex-start;
    box-shadow: 0px 3px 6px -4px rgba(0, 0, 0, 0.12),
        0px 6px 16px rgba(0, 0, 0, 0.08), 0px 9px 28px 8px rgba(0, 0, 0, 0.05);
`;

const MenuItem = styled.div`
    position: relative;
    width: 100%;
    height: 32px;
    display: flex;
    margin: 0px 0px;
    padding: 5px 16px;
    align-items: center;
    flex-direction: row;
    cursor: ${({ disable }) => (disable ? 'not-allowed' : 'pointer')};

    &:hover {
        background: #f5f5f5;
    }

    & > span {
        flex-grow: 0;
        height: 22px;
        font-size: 14px;
        margin: 0px 8px;
        line-height: 22px;
        font-style: normal;
        font-weight: normal;
        align-items: center;
        color: rgba(0, 0, 0, 0.85);
    }
    & > svg {
        width: 10.7px;
        height: 10.7px;
    }

    &:hover > div {
        display: block;
    }
`;

export const ItemDivider = styled.hr`
    margin: 4px 0;
    width: 100%;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
`;
export { Menu, MenuItem };
