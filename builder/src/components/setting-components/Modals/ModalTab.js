import styled, { css } from 'styled-components';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

const TabWrap = styled.ul`
    padding: 0 20px;
    background: ${({ theme }) => theme.primary.bg};
    border-bottom: 2px solid ${({ theme }) => theme.inputBorder};
    margin: 0;
    width: 100%;
    display: flex;
    font-size: 12px;
    align-items: center;
    height: ${({ height }) => (height ? height : '32px')};
    justify-content: ${({ type }) =>
        type === 'boxed' ? 'space-around' : 'space-between'};

    ${(props) => props.style};
`;

function getBorder({ type, theme, isActive }) {
    let borderWidth = css`
        border-width: ${type === 'boxed' ? '2px 0px 2px 2px' : '0'};
        &:last-child {
            border-right-width: ${type === 'boxed' ? '2px;' : null};
        }
    `;
    return css`
        ${borderWidth};
        border-style: solid;
        border-color: ${isActive
            ? theme.primary.fg
            : type === 'boxed'
            ? theme.inputBorder
            : 'transparent'};
    `;
}

function getBorderRadius({ type }) {
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

function getAfter({ type, isActive }) {
    const after = css`
        &:after {
            left: 0;
            content: '';
            width: 100%;
            bottom: -2px;
            position: absolute;
            border-bottom: 2px solid ${({ theme }) => theme.primary.fg};
        }
    `;

    return type !== 'boxed' && isActive ? after : null;
}

const Option = styled.li`
    height: 100%;
    display: flex;
    list-style: none;
    font-weight: 500;
    position: relative;
    align-items: center;
    justify-content: center;

    ${getColor};
    ${getAfter}
    ${getBorder};
    ${getBorderRadius};
    ${({ type }) => (type === 'boxed' ? 'flex: 1 0' : '')};
    cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
`;

/**
 * @typedef {Object} Props
 * @property {string | bool} value
 * @property {string} [title]
 * @property {boolean} [isEdited]
 * @property {boolean} [isDisabled]
 *
 * @param {Props} param0
 */
export const TabOption = React.memo(function TabOption(props) {
    const {
        icon,
        type,
        title,
        name,
        value,
        selected,
        isEdited,
        onSelect,
        children,
        isDisabled,
    } = props;
    const withIcon = icon && children ? true : false;
    const iconStyle = {
        marginRight: '5px',
    };
    const handleSelect = () => !isDisabled && onSelect({ name, value });

    return (
        <Option
            // theme={{ primary, bodyText, inputBorder }}
            isActive={selected === value}
            isDisabled={isDisabled}
            onClick={handleSelect}
            isEdited={isEdited}
            title={title}
            type={type}
        >
            {icon && (
                <FontAwesomeIcon
                    fixedWidth
                    icon={icon}
                    style={withIcon ? iconStyle : null}
                />
            )}
            {children}
        </Option>
    );
});

/**
 * @typedef {Object} Props
 * @property {string | bool} selected
 * @property {function} onSelect
 * @property {string} [height]
 * @property {string} [type]
 * @property {string} name
 *
 * @param {Props} props
 */
const Tab = (props) => {
    const {
        className,
        children,
        onSelect,
        selected,
        height,
        name,
        width,
        style,
        type,
    } = props;
    return (
        <TabWrap
            type={type}
            style={style}
            width={width}
            height={height}
            className={className}
        >
            {React.Children.map(children, (child) =>
                React.cloneElement(child, { onSelect, selected, type, name })
            )}
        </TabWrap>
    );
};

Tab.propTypes = {
    onSelect: PropTypes.func.isRequired,
    selected: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
};

export default React.memo(Tab);
