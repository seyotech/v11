/*****************************************************
 * Packages
 ******************************************************/
import React from 'react';
import styled from 'styled-components';
/*****************************************************
 * Local
 ******************************************************/
import { Body } from './AddSectionModal.stc';
import { ElementContext } from '../../../../contexts/ElementRenderContext';
/*****************************************************
 * Styles
 ******************************************************/
const ColumnModalBody = styled(Body)`
    display: grid;
    grid-gap: 25px;
    grid-template-columns: repeat(4, 1fr);
`;

const ColumnButton = styled.div`
    height: 50px;
    display: grid;
    cursor: pointer;
    grid-column-gap: 5px;
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

const cmsRowCOl = ['1', '1+1', '1+1+1', '1+1+1+1', '1+1+1+1+1', '1+1+1+1+1+1'];

function EmptyCMSRowCol({ type, data = cmsRowCOl }) {
    const { addColumn } = React.useContext(ElementContext);
    return (
        <ColumnModalBody>
            {data.map((col, idx) => (
                <ColumnButton
                    key={idx}
                    col={getColCount(col)}
                    onClick={() => addColumn(col, { cmsRow: true })}
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

export default EmptyCMSRowCol;
