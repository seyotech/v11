import PT from 'prop-types';
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Wrapper = styled.div``;

const Panel = styled.div`
    margin-top: ${({ gap }) => gap};
    background: ${({ theme }) => theme.primary.bg};

    ${getType}
`;
export const AccordionItem = ({
    children,
    index,
    id,
    gap = '8px',
    ...rest
}) => {
    return (
        <Panel
            elType={rest.type}
            gap={typeof gap === 'number' ? `${gap}px` : gap}
        >
            {React.Children.map(children, (child) =>
                React.cloneElement(child, rest)
            )}
        </Panel>
    );
};

export const AccordionDraggable = React.forwardRef(
    ({ style, children, gap = '10px', ...rest }, ref) => {
        return (
            <Panel
                ref={ref}
                style={style}
                elType={rest.type}
                gap={typeof gap === 'number' ? `${gap}px` : gap}
            >
                {React.Children.map(children, (child) =>
                    React.cloneElement(child, rest)
                )}
            </Panel>
        );
    }
);

const Text = styled.div`
    height: ${({ isSidebar }) => (isSidebar ? '32px' : '40px')};
    display: flex;
    font-size: ${({ isSidebar }) => (isSidebar ? '12px' : '14px')};
    padding: ${({ homepage }) => (homepage ? 0 : `0 20px`)};
    padding-left: 15px;
    font-weight: 500;
    align-items: center;
    text-transform: uppercase;
    justify-content: space-between;
    cursor: ${({ onlyIconToggle }) => (onlyIconToggle ? 'default' : 'pointer')};
    color: ${({ theme, isExpended }) =>
        !isExpended ? theme.titleText : theme.primary.fg};

    .icon {
        cursor: ${({ onlyIconToggle }) =>
            !onlyIconToggle ? 'default' : 'pointer'};
    }

    .icon-toggle {
        cursor: pointer;
        color: ${({ theme, isExpended }) =>
            !isExpended ? theme.titleText : theme.primary.fg};
    }

    ${getSize}
`;

function getType({ elType }) {
    if (elType === 'box') {
        return css`
            border-radius: 5px;
            border: 1px solid ${({ theme }) => theme.borderPaleGrey};
        `;
    }
}
function getSize({ size, isSidebar }) {
    if (size === 'sm') {
        return css`
            height: ${isSidebar ? '26px' : '32px'};
            font-size: ${isSidebar ? '12px' : '14px'};
            text-transform: initial;

            .icon {
                width: 32px;
                height: 32px;
                text-align: center;
                line-height: 32px;
            }

            .icon-toggle {
                margin-right: -20px;
            }
        `;
    }
}

export const AccordionSummary = (props) => {
    const {
        type,
        children,
        expanded,
        itemIndex,
        expendedIcon,
        collapsedIcon,
        handleExpanded,
        ...restOfProps
    } = props;
    const { onlyIconToggle } = restOfProps;
    const isExpended = Array.isArray(expanded)
        ? expanded.includes(itemIndex)
        : expanded === itemIndex;
    const icon = isExpended ? expendedIcon : collapsedIcon;

    return (
        <Text
            elType={type}
            isExpended={isExpended}
            onClick={(e) => !onlyIconToggle && handleExpanded(itemIndex, e)}
            {...restOfProps}
        >
            {children}
            {!restOfProps.homepage && (
                <span
                    className="icon icon-toggle"
                    data-testid="toggle"
                    onClick={(e) =>
                        onlyIconToggle && handleExpanded(itemIndex, e)
                    }
                >
                    <FontAwesomeIcon fixedWidth icon={['far', icon]} />
                </span>
            )}
        </Text>
    );
};

const PanelBody = styled.div`
    font-size: ${({ isSidebar }) => (isSidebar ? '12px' : '14px')};
    padding: ${({ gap, isSidebar }) => `${gap || (isSidebar ? 6 : 16)}px`};
    padding-top: 0;
    border-top: ${({ theme }) => `1px solid ${theme.inputBorder}`};
`;

export const AccordionDetails = (props) => {
    const { children, expanded, itemIndex, type, homepage } = props;
    const isExpended = Array.isArray(expanded)
        ? expanded.includes(itemIndex)
        : expanded === itemIndex;
    if (!isExpended || homepage) return null;

    return (
        <PanelBody elType={type} isHomepage={homepage} {...props}>
            {/* <hr className="panel-top-border" /> */}
            {children}
        </PanelBody>
    );
};

const Accordion = (props) => {
    const { children, toggleable, onExpend, onCollapse, ...rest } = props;
    const defaultExpended = toggleable ? 0 : [0];
    const [expanded, setExpanded] = useState(defaultExpended);
    const handleExpanded = React.useCallback(
        (index, e) => {
            if (toggleable) {
                if (expanded === index) {
                    setExpanded(false);
                    onCollapse(e, { index });
                } else {
                    setExpanded(index);
                    onExpend(e, { index });
                }
            } else {
                if (!Array.isArray(expanded)) {
                    setExpanded([index]);
                } else {
                    if (expanded.includes(index)) {
                        let result = [...expanded];
                        result.splice(result.indexOf(index), 1);
                        result = result.length === 0 ? false : result;
                        setExpanded(result);
                        onCollapse(e);
                    } else {
                        const result = [...expanded];
                        result.push(index);
                        setExpanded(result);
                        onExpend(e);
                    }
                }
            }
        },
        [expanded, onCollapse, onExpend, toggleable]
    );

    return (
        <Wrapper>
            {React.Children.map(children, (child, itemIndex) =>
                React.cloneElement(child, {
                    expanded,
                    itemIndex,
                    handleExpanded,
                    ...rest,
                })
            )}
        </Wrapper>
    );
};

function fn() {}
Accordion.defaultProps = {
    onExpend: fn,
    onCollapse: fn,
};
Accordion.propTypes = {
    onExpend: PT.func,
    onCollapse: PT.func,
};

export default React.memo(Accordion);
