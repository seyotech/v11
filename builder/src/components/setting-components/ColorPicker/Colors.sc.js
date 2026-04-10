import styled from 'styled-components';

export const ColorsWrap = styled.div`
    margin-top: 10px;
    border-radius: 5px;
    border: 1px solid ${({ theme }) => theme.inputBorder};
    background-color: ${({ theme }) => theme.primary.bg};
`;

export const Colors = styled.ul`
    margin: 0;
    padding: 0;
    padding: 5px;
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    align-items: center;

    li {
        width: 26px;
        margin: 3px;
        height: 26px;
        cursor: pointer;
        font-size: 24px;
        line-height: 26px;
        color: var(--color-danger-500);

        &:not(.no-style) {
            border-radius: 26px;
            align-items: center;
            display: inline-flex;
            justify-content: center;
            border: 1px solid rgba(0, 0, 0, 0.1);
        }

        &.active {
            color: ${({ theme }) => theme.primary.fg};
            border: 2px solid currentColor;
        }
    }
`;

export const LI = styled.li`
    transition: box-shadow 0.15s;
    background-color: ${({ color }) => color};
    box-shadow: ${({ active, color }) =>
        active ? `0 0 0 2px ${color} inset, 0 0 0 7px white inset` : 'none'};
`;

export const Heading = styled.div`
    padding: 6px;
    text-align: center;
    color: ${({ theme }) => theme.titleText};
    border-bottom: 1px solid ${({ theme }) => theme.inputBorder};
`;

export const Header = styled.div`
    height: 40px;
    display: flex;
    font-weight: 500;
    padding-left: 15px;
    align-items: center;
    justify-content: space-between;
    color: ${({ theme }) => theme.titleText};
    border-bottom: 1px solid ${({ theme }) => theme.inputBorder};
`;

export const ModalInner = styled.div`
    width: 300px;
    /* height: 400px; */
    border-radius: 5px;
    transform: translateY(-50%);
    box-shadow: 0 0 60px 0 rgba(43, 53, 86, 0.15);
    background: ${({ theme }) => theme.primary.bg};
`;

export const ModalBody = styled.div`
    padding: 15px;
`;

export const DragArea = styled.div`
    width: 100%;
    height: 100%;
`;
