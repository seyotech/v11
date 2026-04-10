import styled from 'styled-components';

export const BuilderWrap = styled.div`
    display: flex;
`;

export const Aside = styled.aside`
    position: relative;
`;

export const BuilderBody = styled.div`
    flex: 1;
    height: 100%;
    overflow: hidden;
    position: relative;
    padding: 6px 6px 0;
`;

export const AsideMain = styled.div`
    width: 50px;
    height: 100%;
    z-index: 100;
    position: relative;
    background: ${({ theme }) => theme.primary.bg};
    box-shadow: 0 2px 8px 0 rgba(43, 53, 86, 0.05);

    > div {
        height: 50px;
        display: flex;
        cursor: pointer;
        font-size: 20px;
        align-items: center;
        justify-content: center;
        color: ${({ theme }) => theme.primary.color};
        border-top: 1px solid ${({ theme }) => theme.borderPaleGrey};

        &:last-child {
            border-bottom: 1px solid ${({ theme }) => theme.borderPaleGrey};
        }

        &:hover::not(.active) {
            color: ${({ theme }) => theme.primary.fg};
        }

        &.active {
            color: ${({ theme }) => theme.primary.bg};
            background: ${({ theme }) => theme.primary.fg};
        }
    }
`;

export const AsideExpend = styled.div`
    top: 1px;
    left: -280px;
    width: 280px;
    z-index: 99;
    height: 100%;
    overflow-y: auto;
    position: absolute;
    transition: left 0.35s ease-in-out;
    background: ${({ theme }) => theme.primary.bg};
    box-shadow: 0 2px 8px 0 rgba(43, 53, 86, 0.05),
        0 -2px 8px 0 rgba(43, 53, 86, 0.05);
`;

export const AsideExpendHead = styled.div`
    height: 50px;
    display: flex;
    padding: 0 20px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid ${({ theme }) => theme.borderPaleGrey};

    button {
        margin-right: -20px;
    }
`;
export const AsideExpendBody = styled.div`
    padding: 20px;
    height: calc(100% - 50px);
    overflow-y: auto;
`;
