import styled from 'styled-components';

import columns from 'components/editor-resources/columns';
import useEditorModal from 'hooks/useEditorModal';
import chunk from 'util/chunk';
import isFloat from 'util/isFloat';
import { antToken } from '../../../../antd.theme';

const ColumnsTable = styled.table`
    width: 100%;
    border-spacing: 0;
    border-radius: 6px;
    border: 1px solid ${({ theme }) => theme.inputBorder};

    tr:not(:last-child) {
        td {
            border-bottom: 1px solid ${({ theme }) => theme.inputBorder};
        }
    }
`;

const TD = styled.td`
    padding: 4px;
    text-align: center;
    color: ${({ theme, $isActive }) =>
        $isActive ? antToken.colorPrimary : theme.bodyText};

    &:not(:last-child) {
        border-right: 1px solid ${({ theme }) => theme.inputBorder};
    }
`;

const ProgressBar = styled.div`
    height: 40px;
    margin-bottom: 4px;
    background: ${({ theme }) => theme.inputBg};
`;
const Progress = styled.div`
    height: inherit;
    background-color: ${({ theme, $isActive }) =>
        $isActive ? antToken.colorPrimary : theme.inputBorder};
`;

export const ColumnSize = ({ onChange, name, value }) => {
    const handleClick = (selector) => onChange({ name, value: selector });
    const { isSidebar } = useEditorModal();

    return (
        <ColumnsTable>
            <tbody>
                {chunk(columns, 3).map((chunked, ci) => (
                    <tr key={ci}>
                        {chunked.map((col, colIdx) => (
                            <TD
                                $isSidebar={isSidebar}
                                key={colIdx}
                                $isActive={value === col.selector}
                                onClick={() => handleClick(col.selector)}
                            >
                                <ProgressBar>
                                    <Progress
                                        $isActive={value === col.selector}
                                        style={{ width: col.size + '%' }}
                                    />
                                </ProgressBar>
                                <span style={{ fontSize: 11 }}>
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
