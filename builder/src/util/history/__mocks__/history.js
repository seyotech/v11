export const initialHistory = new Map();

const oneRecord = new Map([['hid_1', { type: 'PAGE', data: 'history_1' }]]);

const twoRecords = new Map([
    ['hid_1', { type: 'PAGE', data: 'history_1' }],
    ['hid_2', { type: 'PAGE', data: 'history_2' }],
]);

const threeRecords = new Map([
    ['hid_1', { type: 'PAGE', data: 'history_1' }],
    ['hid_2', { type: 'PAGE', data: 'history_2' }],
    ['hid_3', { type: 'PAGE', data: 'history_3' }],
]);

const fourRecords = new Map([
    ['hid_1', { type: 'PAGE', data: 'history_1' }],
    ['hid_2', { type: 'PAGE', data: 'history_2' }],
    ['hid_3', { type: 'PAGE', data: 'history_3' }],
    ['hid_4', { type: 'PAGE', data: 'history_4' }],
]);

export const createHistoryForSavedPage = ({
    cursor,
    pageId,
    recordsLength,
}) => {
    const records =
        {
            1: oneRecord,
            2: twoRecords,
            3: threeRecords,
            4: fourRecords,
        }[recordsLength] || oneRecord;
    return [
        pageId,
        {
            cursor,
            records,
        },
    ];
};

export const createHistoryForUnSavedPage = ({
    pageIndex,
    cursor,
    recordsLength,
}) => {
    const records =
        {
            1: oneRecord,
            2: twoRecords,
            3: threeRecords,
            4: fourRecords,
        }[recordsLength] || oneRecord;
    return [
        [`page-${pageIndex}`, `nid_${pageIndex}`],
        [
            `nid_${pageIndex}`,
            {
                cursor,
                records,
            },
        ],
    ];
};
