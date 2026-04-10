import styled from 'styled-components';

export const PagesWrap = styled.div``;

export const PageBody = styled.div`
    label {
        font-size: 14px;
        margin-top: 15px;
    }
`;

export const Icon = styled.span`
    border-style: solid;
    border-width: 0 1px 0 0;
    border-color: ${({ theme }) => theme.borderPaleGrey};

    &:nth-child(2) {
        border-left-width: 1px;
    }
`;

export const Label = styled.span`
    flex: 1;
    height: 100%;
    display: flex;
    cursor: pointer;
    overflow: hidden;
    line-height: 32px;
    padding-left: 15px;
    margin-left: -16px;
    align-items: center;
    white-space: nowrap;
    display: inline-block;
    text-overflow: ellipsis;
    border-radius: 5px 0 0 5px;
    background: ${({ theme, active }) => active && theme.primary.fg};
    color: ${({ theme, active }) => (active ? '#ffffff' : theme.titleText)};

    &:hover {
        color: ${({ theme, active }) => !active && theme.primary.fg};
    }
`;
