import styled from 'styled-components';
import React from 'react';

import isFloat from '../../util/isFloat';
import chunk from '../../util/chunk';
import columns from '../editor-resources/columns';
import useEditorModal from '../../hooks/useEditorModal';

const ColumnsTable = styled.table`
    width: 100%;
    border-spacing: 0;
    border-radius: 5px;
    border: 1px solid ${({ theme }) => theme.inputBorder};

    tr:not(:last-child) {
        td {
            border-bottom: 1px solid ${({ theme }) => theme.inputBorder};
        }
    }
`;

const TD = styled.td`
    padding: ${({ isSidebar }) => (isSidebar ? '6px' : '10px')};
    text-align: center;
    color: ${({ theme, isActive }) =>
        isActive ? theme.primary.fg : theme.bodyText};

    &:not(:last-child) {
        border-right: 1px solid ${({ theme }) => theme.inputBorder};
    }
`;

const ProgressBar = styled.div`
    height: ${({ isSidebar }) => (isSidebar ? '48px' : '55px')};
    margin-bottom: 5px;
    background: ${({ theme }) => theme.inputBg};
`;
const Progress = styled.div`
    height: inherit;
    background-color: ${({ theme, isActive }) =>
        isActive ? theme.primary.fg : theme.inputBorder};
`;

const ColumnSize = ({ onChange, name, value }) => {
    const handleClick = (selector) => onChange({ name, value: selector });
    const { isSidebar } = useEditorModal();

    return (
        <ColumnsTable>
            <tbody>
                {chunk(columns, 3).map((chunked, ci) => (
                    <tr key={ci}>
                        {chunked.map((col, colIdx) => (
                            <TD
                                isSidebar={isSidebar}
                                key={colIdx}
                                isActive={value === col.selector}
                                onClick={() => handleClick(col.selector)}
                            >
                                <ProgressBar>
                                    <Progress
                                        isActive={value === col.selector}
                                        style={{ width: col.size + '%' }}
                                    />
                                </ProgressBar>
                                <span>
                                    {col.selector} -{' '}
                                    {isFloat(col.size)
                                        ? col.size.toFixed(2)
                                        : col.size}
                                    %
                                </span>
                            </TD>
                        ))}
                    </tr>
                ))}
            </tbody>
        </ColumnsTable>
    );
};
export default ColumnSize;
