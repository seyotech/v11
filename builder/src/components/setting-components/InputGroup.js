import React from 'react';
import styled from 'styled-components';
import uniqId from '../../util/uniqId';

const IG = styled.div`
    display: flex;
    font-size: ${({ isSidebar }) => (isSidebar ? '12px' : '14px')};
    border: 1px solid transparent;
    color: ${({ theme }) => theme.bodyText};
    border-radius: ${({ $hasError }) => ($hasError ? '5px' : null)};
    overflow: hidden;

    > * {
        &:not(:last-child) {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
        &:not(:first-child) {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
        &:not(:first-child) {
            border-left-width: 0;
        }
    }

    .tab {
        li:first-child {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    }

    > .input-wrap {
        flex-grow: 1;
    }
`;
const Label = styled.label`
    margin: 0;
    height: ${({ isSidebar }) => (isSidebar ? '26px' : '32px')};
    display: flex;
    font-weight: 500;
    border-radius: 5px;
    align-items: center;
    white-space: nowrap;
    min-width: ${({ labelWidth }) => labelWidth};
    padding: ${({ noPad, isSidebar }) =>
        noPad ? null : isSidebar ? '2px 4px' : '4px 8px'};
    justify-content: ${({ noPad }) => (noPad ? 'center' : null)};
    border: 1px solid
        ${({ theme, $hasError }) => ($hasError ? 'red' : theme.inputBorder)};
`;

/**
 * @typedef {Object} Props
 * @property {string} [labelWidth]
 * @property {string|object|function} [label]
 * @property {boolean} [labelAlt]
 * @param {Props} param0
 */
const InputGroup = ({
    label,
    hasError,
    labelAlt,
    children,
    labelWidth,
    ...restOfProps
}) => {
    const inputId = label ? uniqId() : null;
    const isLabelString = typeof label === 'string';

    return (
        <IG $hasError={hasError} {...restOfProps}>
            {label && !labelAlt && (
                <Label
                    htmlFor={inputId}
                    $hasError={hasError}
                    noPad={!isLabelString}
                    labelWidth={labelWidth}
                    {...restOfProps}
                >
                    {label}
                </Label>
            )}
            {React.Children.map(children, (child) =>
                !child ? null : React.cloneElement(child, { inputId })
            )}

            {label && labelAlt && (
                <Label
                    htmlFor={inputId}
                    hasError={hasError}
                    noPad={!isLabelString}
                    labelWidth={labelWidth}
                >
                    {label}
                </Label>
            )}
        </IG>
    );
};
export default React.memo(InputGroup);
