import React from 'react';
import styled from 'styled-components';

import { ElementContext } from '../../../../contexts/ElementRenderContext';
import { Body } from './AddSectionModal.stc';

const ColumnModalBody = styled(Body)`
    display: grid;
    grid-gap: 25px;
    grid-template-columns: repeat(4, 1fr);
`;

const ColumnButton = styled.div`
    height: 50px;
    display: flex;
    cursor: pointer;
    gap: 5px;
    flex-wrap: wrap;

    &:hover span {
        background: var(--color-primary-500);
        color: white;
    }
`;
const Span = styled.span`
    transition: all 0.25s;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    width: ${({ width }) => width}%;
    background: ${({ isLighten }) => (isLighten ? '#f3f3f3' : '#b9c2ca')};
    font-size: 10px;
`;

function getColCount(formula) {
    const columns = formula.split('+');
    return columns.reduce((num, curr) => num + parseInt(curr), 0);
}

const emptyRowCol = [
    '100',
    '50+50',
    '25+75',
    '40+60',
    '25+25+50',
    '25+50+25',
    '25+25+25+25',
    '33+67',
    '75+25',
];

function EmptyContainer({ type, nestedEl = false, data = emptyRowCol }) {
    const { addContainers } = React.useContext(ElementContext);
    return (
        <ColumnModalBody>
            {data.map((col, idx) => (
                <ColumnButton
                    key={idx}
                    col={getColCount(col)}
                    onClick={() => addContainers({ cols: col })}
                >
                    {col.split('+').map((width, colIdx) => (
                        <Span
                            width={width - 2.5}
                            key={colIdx}
                            isLighten={type === 'CONTAINER' && colIdx !== 0}
                        >
                            {!(type === 'CONTAINER' && colIdx !== 0) && width}
                        </Span>
                    ))}
                </ColumnButton>
            ))}
        </ColumnModalBody>
    );
}

export default EmptyContainer;
