import React, { useContext } from 'react';
import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThemeContext } from 'styled-components';

const buttonSizes = {
    x: css`
        padding: 1px 3px;
        font-size: 8px;
        font-weight: 400;
        border-radius: 2px;
    `,
    xs: css`
        padding: 3px 5px;
        font-size: 12px;
        font-weight: 400;
        border-radius: 2px;
    `,
    sm: css`
        padding: 8px 12px;
        font-size: 14px;
        font-weight: 400;
        border-radius: 3px;
    `,
    md: css`
        padding: 12px 18px;
        font-size: 16px;
        font-weight: 500;
        border-radius: 4px;
    `,
    lg: css`
        padding: 14px 22px 16px;
        font-size: 16px;
        font-weight: 500;
        border-radius: 5px;
    `,
    xlg: css`
        padding: 12px 25px;
        font-size: 20px;
        font-weight: 500;
        border-radius: 6px;
    `,
};

function getBtnSize({ size, Height, Width }) {
    if (size === 'none') {
        return null;
    }
    let style = size ? buttonSizes[size] : buttonSizes['md'];

    if (Width) {
        // style = style[0].replace(/padding:.+;/, '');
    }
    return style;
}

function getBackgroundColor({ border, color, styleType }) {
    if (border) {
        return css`
            background: transparent;
            &:hover {
                background: ${color.bg};
            }
        `;
    }
    if (styleType === 'none') {
        return css`
            background: transparent;
        `;
    }
    return css`
        background: ${color.bg};
    `;
}

function getBorder({ border, color }) {
    if (!border) {
        return css`
            border: 1px solid transparent;
        `;
    }
    return css`
        border: 1px ${border} ${color.bg};
        &:hover {
            border-style: solid;
        }
    `;
}

function getColor({ border, color, styleType }) {
    if (border) {
        return css`
            color: ${color.bg};
            &:hover {
                color: ${color.fg};
            }
        `;
    }
    if (styleType === 'none') {
        return css`
            color: inherit;
        `;
    }
    return css`
        color: ${color.fg};
    `;
}

function getDisabled({ disabled }) {
    if (disabled) {
        return css`
            opacity: 0.5;
            cursor: not-allowed;
        `;
    }
}

const ActionButton = styled.button`
    outline: ${({ styleType }) => (styleType === 'none' ? 'none' : null)};
    height: ${({ Height }) => Height};
    width: ${({ Width }) => Width};
    cursor: pointer;

    ${getColor}
    ${getBorder}
    ${getBtnSize}
    ${getDisabled}
    ${getBackgroundColor};
`;

const Button = (props) => {
    const {
        border,
        height,
        width,
        children,
        icon,
        innerRef,
        type,
        size,
        btnType = 'button',
        ...restOfProps
    } = props;

    const { buttons } = useContext(ThemeContext);
    const color = buttons[type] || buttons.primary;

    return (
        <ActionButton
            size={size}
            color={color}
            Width={width}
            type={btnType}
            ref={innerRef}
            Height={height}
            border={border}
            styleType={type}
            {...restOfProps}
        >
            {icon && <FontAwesomeIcon icon={icon} fixedWidth />}
            {children}
        </ActionButton>
    );
};
export default Button;
