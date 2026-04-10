import React from 'react';
import styled, { css } from 'styled-components';
import { inputField } from './shared-styles';

const getFrameStyles = ({ isFrames, isSelected, theme }) => {
    if (isFrames) {
        return css`
            padding: 5px;
            background: transparent;
            color: ${({ theme, isSelected }) => isSelected && theme.primary.fg};
            border: ${isSelected ? `1px solid ${theme.primary.fg}` : 'none'};
        `;
    }
};

const Input = styled.input`
    ${inputField};
    width: 100%;
`;

const IconList = styled.ul`
    margin: 0;
    display: flex;
    padding: 15px;
    list-style: none;
    flex-wrap: wrap;
    overflow: scroll;
    max-height: 200px;
`;

const LI = styled.li`
    display: flex;
    cursor: pointer;
    border-radius: 5px;
    align-items: center;
    justify-content: center;
    width: calc(100% / ${({ _cols }) => _cols || 1});
    height: ${({ itemHeight }) => itemHeight || '41px'};
    /* border: ${({ isSelected }) => (isSelected ? `1px solid` : '')}; */
    color: ${({ isSelected, theme }) => isSelected && theme.primary.bg};
    background: ${({ theme, isSelected }) => isSelected && theme.primary.fg};
    ${({ none, theme }) => none && `border-radius: 5px;`};
    ${getFrameStyles};
    svg {
        width: 100%;
        height: 100%;
    }
`;

export const Option = ({
    none,
    name,
    value,
    selected,
    isIcon,
    children,
    onSelect,
    ...restOfProps
}) => {
    const isSelected = selected
        ? !isIcon || !value || !selected
            ? value === selected
            : selected.prefix === value.prefix &&
              selected.iconName === value.iconName
        : false;

    return (
        <LI
            isIcon={isIcon}
            isSelected={isSelected}
            onClick={() => {
                onSelect({ name, value });
            }}
            {...restOfProps}
        >
            {children}
        </LI>
    );
};

/**
 * @typedef {Object} Props
 * @property {string} [cols]
 * @property {string} [name]
 * @property {Function} [onFilter]
 * @property {string} [placeholder]
 * @property {string} [itemHeight]
 *
 * @param {Props} param0
 */

const IconFilter = ({
    cols,
    name,
    onSelect,
    onFilter,
    children,
    itemHeight,
    placeholder,
    value: selected,
}) => {
    const handleFilter = (event) => {
        const { value } = event.target;
        onFilter({ name, value });
    };

    return (
        <>
            <Input
                className="input-wrap"
                onChange={handleFilter}
                placeholder={placeholder}
            />
            <IconList>
                {React.Children.map(children, (child) => {
                    if (child === null) {
                        return null;
                    }
                    return React.cloneElement(child, {
                        name,
                        selected,
                        onSelect,
                        _cols: cols,
                        itemHeight,
                    });
                })}
            </IconList>
        </>
    );
};
export default IconFilter;
