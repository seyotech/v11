import React from 'react';
import { Title, TitleWrap } from './AddSectionModal.stc';
import EmptyRowCol from './EmptyRowCol';

const emptyRowCol = [
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

function NestedRowCol() {
    return (
        <React.Fragment>
            <TitleWrap>
                <Title>Nested Row with Columns</Title>
            </TitleWrap>
            <EmptyRowCol type="SECTION" nestedEl={true} data={emptyRowCol} />
        </React.Fragment>
    );
}

export default NestedRowCol;
