/*****************************************************
 * Packages
 ******************************************************/
import React from 'react';
import styled from 'styled-components';
/*****************************************************
 * Local
 ******************************************************/
import { ElementContext } from '../../../../contexts/ElementRenderContext';
/*****************************************************
 * Styles
 ******************************************************/
const ColumnModalBody = styled.div`
    display: grid;
    grid-gap: 12px;
    grid-template-columns: repeat(3, 1fr);
`;

const ColumnButton = styled.div`
    height: 50px;
    display: grid;
    cursor: pointer;
    grid-column-gap: 2px;
    grid-template-columns: repeat(${({ col }) => (col ? col : 3)}, 1fr);

    &:hover span {
        background: var(--color-primary-500);
    }
`;
const Span = styled.span`
    transition: all 0.25s;
    border-radius: 5px;
    grid-column-end: span ${({ span }) => span};
    background: ${({ isLighten }) => (isLighten ? '#f3f3f3' : '#b9c2ca')};
`;

function getColCount(formula) {
    const columns = formula.split('+');
    return columns.reduce((num, curr) => num + parseInt(curr), 0);
}

const emptyRowCol = [
    '1',
    '1+1',
    '1+1+1',
    '1+1+1+1',
    '1+1+1+1+1',
    '1+1+1+1+1+1',
    '1+2',
    '2+1',
    '1+3',

    '3+1',
    '1+4',
    '4+1',
    '4+2',
    '2+3',
];

function EmptyRowCol({ type, nestedEl = false, data = emptyRowCol }) {
    const { addColumn } = React.useContext(ElementContext);
    return (
        <ColumnModalBody>
            {data.map((col, idx) => (
                <ColumnButton
                    key={idx}
                    col={getColCount(col)}
                    onClick={() => addColumn(col, { nestedEl })}
                >
                    {col.split('+').map((span, colIdx) => (
                        <Span
                            span={span}
                            key={colIdx}
                            isLighten={type === 'COLUMN' && colIdx !== 0}
                        />
                    ))}
                </ColumnButton>
            ))}
        </ColumnModalBody>
    );
}

export default EmptyRowCol;
