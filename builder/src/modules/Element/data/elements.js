import generalElements from './element/generalElements';
import structureElements from './element/structureElements';

const elements = [
    {
        id: '1',
        title: 'General Elements',
        items: generalElements,
        type: 'regular',
    },
    {
        id: '2',
        title: 'Layout',
        items: structureElements,
        type: 'structured',
    },
];

export const containerTypeEnums = {
    MULTI: 'MULTI',
    SINGLE: 'SINGLE',
};

export const containerBlocks = [
    '1',
    '1+1',
    '1+1+1',
    '1+1+1+1',
    '1+1+1+1+1',
    // '1+1+1+1+1+1',
    '1+2',
    '2+1',
    '1+3',
    '3+1',
    '1+4',
    '4+1',
    '4+2',
    '2+4',
    '2+3',
    '3+2',
];

export const columnTypeEnums = {
    NESTED_ROW_COLUMN: 'NESTED_ROW_COLUMN',
    REGULAR_ROW_COLUMN: 'REGULAR_ROW_COLUMN',
};

export const columnBlocks = {
    [columnTypeEnums.REGULAR_ROW_COLUMN]: [
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
    ],

    [columnTypeEnums.NESTED_ROW_COLUMN]: [
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
    ],
};

export default elements;
