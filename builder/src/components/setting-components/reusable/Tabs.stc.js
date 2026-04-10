import styled, { css } from 'styled-components';

export const TabWrap = styled.ul`
    margin: 0;
    padding: 0;
    width: 100%;
    display: flex;
    font-size: ${({ isSidebar }) => (isSidebar ? '12px' : '14px')};
    align-items: center;
    justify-content: space-around;
    height: ${({ height }) => (height ? height : '32px')};

    ${(props) => props.style};
`;

function getBorder({ type, theme, isActive }) {
    let borderWidth = css`
        border-width: ${type === 'boxed' ? '2px 0px 2px 2px' : '0px 0px 2px'};
        &:last-child {
            border-right-width: ${type === 'boxed' ? '2px;' : null};
        }
    `;
    return css`
        ${borderWidth};
        border-style: solid;
        border-color: ${isActive ? theme.primary.fg : theme.inputBorder};
    `;
}

function getBorderRadius({ type, theme }) {
    if (type === 'boxed') {
        return css`
            &:first-child {
                border-top-left-radius: 5px;
                border-bottom-left-radius: 5px;
            }
            &:last-child {
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
            }
        `;
    }
}

function getColor({ type, theme, isEdited, isActive, isDisabled }) {
    const { primary, bodyText, disabledText } = theme;
    if (type === 'underlined') {
        return css`
            color: ${isActive ? primary.fg : bodyText};
            background: ${primary.bg};
        `;
    }
    if (type === 'boxed') {
        return css`
            color: ${isActive
                ? primary.bg
                : isEdited
                ? primary.fg
                : isDisabled
                ? disabledText
                : bodyText};
            background: ${isActive ? primary.fg : primary.bg};
        `;
    }
}

export const Option = styled.li`
    flex: 1 0;
    height: 100%;
    display: flex;
    list-style: none;
    font-weight: 500;
    align-items: center;
    justify-content: center;

    .icon {
        margin-right: 5px;
    }

    ${getColor};
    ${getBorder};
    ${getBorderRadius};
    cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
`;
