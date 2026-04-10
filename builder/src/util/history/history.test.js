import {
    initialHistory,
    createHistoryForSavedPage,
    createHistoryForUnSavedPage,
} from './__mocks__/history';
import {
    undo,
    redo,
    setHistory,
    clearHistory,
    getHistoryState,
    getClonedHistory,
    setHistoryPageId,
    updateHistoryPageId,
    clearUnSavedPagesHistory,
} from './index';

const updaterFn = vi.fn();

describe('getClonedHistory', () => {
    test('should return cloned history', () => {
        const history = new Map([['pid_1', { records: new Map() }]]);
        const result = getClonedHistory(history);

        expect(result).toStrictEqual(history);
        result.set('pid_2', { records: new Map() });
        expect(result.has('pid_2')).toBeTruthy();
        expect(history.has('pid_2')).toBeFalsy();
    });

    test('should return cloned history', () => {
        const history = new Map([
            ['pid_1', { records: new Map() }],
            ['page-1', 'nid_1'],
        ]);
        const result = getClonedHistory(history);

        expect(result).toStrictEqual(history);
        result.set('pid_2', { records: new Map() });
        expect(result.has('pid_2')).toBeTruthy();
        expect(history.has('pid_2')).toBeFalsy();
    });
});

describe('getHistoryState', () => {
    describe('next previous', () => {
        test('should return current cursor only', () => {
            const pageId = 'pid_1';
            const cursor = 'hid_1';
            const history1 = new Map([
                createHistoryForSavedPage({
                    pageId,
                    cursor,
                    recordsLength: 1,
                }),
            ]);

            const result = getHistoryState({
                pageId,
                history: history1,
            });

            expect(result).toStrictEqual({
                key: pageId,
                current: cursor,
                next: undefined,
                previous: undefined,
            });
        });

        test('should return previous and current cursor', () => {
            const pageId = 'pid_100';
            const cursor = 'hid_2';
            const history1 = new Map([
                createHistoryForSavedPage({
                    pageId,
                    cursor,
                    recordsLength: 2,
                }),
            ]);

            const result = getHistoryState({
                pageId,
                history: history1,
            });

            expect(result).toStrictEqual({
                key: pageId,
                next: undefined,
                previous: 'hid_1',
                current: cursor,
            });
        });

        test('should return next and current cursor', () => {
            const pageId = 'pid_50';
            const history1 = new Map([
                createHistoryForSavedPage({
                    pageId,
                    cursor: 'hid_1',
                    recordsLength: 2,
                }),
            ]);

            const result = getHistoryState({
                pageId,
                history: history1,
            });

            expect(result).toStrictEqual({
                key: pageId,
                next: 'hid_2',
                previous: undefined,
                current: 'hid_1',
            });
        });

        test('should return current, next and previous cursor', () => {
            const pageId = 'pid_1';
            const history1 = new Map([
                createHistoryForSavedPage({
                    pageId,
                    cursor: 'hid_2',
                    recordsLength: 3,
                }),
            ]);

            const result = getHistoryState({
                pageId,
                history: history1,
            });

            expect(result).toStrictEqual({
                key: pageId,
                next: 'hid_3',
                previous: 'hid_1',
                current: 'hid_2',
            });
        });

        test('should return current, next and previous cursor (pageIndex)', () => {
            const pageIndex = 2;
            const cursorIndex = 2;
            const history = new Map([
                createHistoryForSavedPage({
                    pageId: 'pid_1',
                    recordsLength: 1,
                    cursor: 'hid_2',
                }),
                ...createHistoryForUnSavedPage({
                    pageIndex,
                    recordsLength: 3,
                    cursor: `hid_${cursorIndex}`,
                }),
            ]);

            const result = getHistoryState({
                history,
                pageIndex,
            });

            expect(result).toStrictEqual({
                key: `nid_${pageIndex}`,
                next: `hid_${cursorIndex + 1}`,
                previous: `hid_${cursorIndex - 1}`,
                current: `hid_${cursorIndex}`,
            });
        });

        test('should return current, next and previous cursor (pageIndex more priority than pageId)', () => {
            const pageIndex = 2;
            const cursorIndex = 2;
            const pageId = 'pid_1';
            const history = new Map([
                createHistoryForSavedPage({
                    pageId,
                    recordsLength: 1,
                    cursor: 'hid_2',
                }),
                ...createHistoryForUnSavedPage({
                    pageIndex,
                    recordsLength: 3,
                    cursor: `hid_${cursorIndex}`,
                }),
            ]);

            const result = getHistoryState({
                pageId,
                history,
                pageIndex,
            });

            expect(result).toStrictEqual({
                key: `nid_${pageIndex}`,
                next: `hid_${cursorIndex + 1}`,
                previous: `hid_${cursorIndex - 1}`,
                current: `hid_${cursorIndex}`,
            });
        });

        test('should return next cursor undefined', () => {
            const cursorIndex = 3;
            const pageId = 'pid_1';
            const history = new Map([
                createHistoryForSavedPage({
                    pageId,
                    recordsLength: 3,
                    cursor: `hid_${cursorIndex}`,
                }),
            ]);

            const result = getHistoryState({
                pageId,
                history,
            });

            expect(result).toStrictEqual({
                key: pageId,
                next: undefined,
                previous: `hid_${cursorIndex - 1}`,
                current: `hid_${cursorIndex}`,
            });
        });

        test('should return empty history state as current cursor does not exist in this page history', () => {
            const pageId = 'pid_1';
            const cursor = 'hid_3';
            const history = new Map([
                createHistoryForSavedPage({
                    pageId,
                    recordsLength: 2,
                    cursor,
                }),

                ...createHistoryForUnSavedPage({
                    pageIndex: 3,
                    recordsLength: 1,
                    cursor: 'hid_1',
                }),
            ]);

            const result = getHistoryState({
                pageId,
                history,
            });

            expect(result).toStrictEqual({});
        });

        test('should return empty history state as pageId does not exist in to the history', () => {
            const pageId = 'pid_1';
            const cursor = 'hid_2';
            const history = new Map([
                createHistoryForSavedPage({
                    pageId,
                    recordsLength: 2,
                    cursor,
                }),

                ...createHistoryForUnSavedPage({
                    pageIndex: 3,
                    recordsLength: 1,
                    cursor: 'hid_1',
                }),
            ]);

            const result = getHistoryState({
                history,
                pageId: 'pid_2',
            });

            expect(result).toStrictEqual({});
        });
    });
});

describe('clearHistory', () => {
    const history = new Map([
        createHistoryForSavedPage({
            pageId: 'pid_1',
        }),
        ...createHistoryForUnSavedPage({
            pageIndex: 1,
        }),
        createHistoryForSavedPage({
            pageId: 'pid_2',
        }),
    ]);

    test.each(Array.from(history.keys()))(
        'should remove history by pageId',
        (pageId) => {
            updaterFn.mockReset();

            clearHistory({ history, pageId, updaterFn });

            const result = updaterFn.mock.calls[0][0];

            expect(result.get(pageId)).toBeFalsy();
            expect(history.get(pageId)).toBeTruthy();
        }
    );

    test('should remove history by nanoId (unsaved pages count 1)', () => {
        updaterFn.mockReset();

        const pageIndex = 1;

        const history = new Map([
            createHistoryForSavedPage({
                pageId: 'pid_1',
                recordsLength: 2,
                cursor: 'hid_1',
            }),
            ...createHistoryForUnSavedPage({
                pageIndex,
                cursor: 'hid_2',
                recordsLength: 3,
            }),
        ]);

        clearHistory({ history, pageIndex: 1, updaterFn });

        const result = updaterFn.mock.calls[0][0];

        expect(result.get('page-1')).toBeUndefined();
        expect(result.get('nid_1')).toBeUndefined();
    });

    test('should remove history by nanoId (unsaved pages count 2)', () => {
        updaterFn.mockReset();

        const history = new Map([
            createHistoryForSavedPage({
                pageId: 'pid_1',
            }),
            ...createHistoryForUnSavedPage({
                pageIndex: 1,
                recordsLength: 1,
            }),
            ...createHistoryForUnSavedPage({
                pageIndex: 2,
                recordsLength: 2,
            }),
        ]);

        clearHistory({ history, pageIndex: 1, updaterFn });

        const result = updaterFn.mock.calls[0][0];

        expect(result.get('page-1')).toBe('nid_2');
        expect(result.get('nid_1')).toBeUndefined();
        expect(result.get('nid_2')).toStrictEqual(history.get('nid_2'));
    });

    test('should remove history by nanoId (unsaved pages count 3)', () => {
        updaterFn.mockReset();

        const history = new Map([
            createHistoryForSavedPage({
                pageId: 'pid_1',
            }),
            ...createHistoryForUnSavedPage({
                pageIndex: 1,
                recordsLength: 1,
            }),
            ...createHistoryForUnSavedPage({
                pageIndex: 2,
                recordsLength: 2,
            }),
            ...createHistoryForUnSavedPage({
                pageIndex: 3,
                recordsLength: 3,
            }),
        ]);

        clearHistory({ history, pageIndex: 1, updaterFn });

        const result = updaterFn.mock.calls[0][0];

        expect(result.get('nid_1')).toBeUndefined();
        expect(result.get('page-1')).toBe('nid_2');
        expect(result.get('nid_2')).toStrictEqual(history.get('nid_2'));
        expect(result.get('page-2')).toBe('nid_3');
        expect(result.get('page-3')).toBeUndefined();
        expect(result.get('nid_3')).toStrictEqual(history.get('nid_3'));
    });

    test('should remove history by nanoId (remove page from random place)', () => {
        updaterFn.mockReset();

        const history = new Map([
            ...createHistoryForUnSavedPage({
                pageIndex: 3,
                recordsLength: 2,
            }),
            ...createHistoryForUnSavedPage({
                pageIndex: 7,
                recordsLength: 3,
            }),
            ...createHistoryForUnSavedPage({
                pageIndex: 10,
                recordsLength: 1,
            }),
        ]);

        clearHistory({ history, pageIndex: 7, updaterFn });

        const result = updaterFn.mock.calls[0][0];

        expect(result.get('nid_3')).toStrictEqual(history.get('nid_3'));
        expect(result.get('page-3')).toBe('nid_3');
        expect(result.get('page-7')).toBeFalsy();
        expect(result.get('nid_7')).toBeFalsy();
        expect(result.get('page-9')).toBe('nid_10');
        expect(result.get('nid_10')).toStrictEqual(history.get('nid_10'));
    });

    test.each([3, 5, 2, 7])(
        'should remove history by pageIndex',
        (pageIndex) => {
            updaterFn.mockReset();

            const history = new Map([
                ...createHistoryForUnSavedPage({
                    pageIndex: 3,
                    recordsLength: 2,
                }),
                ...createHistoryForUnSavedPage({
                    pageIndex: 7,
                    recordsLength: 3,
                }),
                ...createHistoryForUnSavedPage({
                    pageIndex: 5,
                    recordsLength: 1,
                }),
                ...createHistoryForUnSavedPage({
                    pageIndex: 2,
                    recordsLength: 1,
                }),
            ]);

            clearHistory({
                history,
                pageIndex,
                updaterFn,
            });

            const result = updaterFn.mock.calls[0][0];

            expect(result.get(`page-${pageIndex}`)).toBeUndefined();
            expect(result.get(`nid_${pageIndex}`)).toBeUndefined();

            expect(history.get(`nid_${pageIndex}`)).toBeDefined();
            expect(history.get(`page-${pageIndex}`)).toBeDefined();
        }
    );

    test.each(['pid_10', 'nid_20'])(
        'should not break anything when pass pageId or nanoId that does not exist',
        (pageId) => {
            updaterFn.mockReset();

            const history = new Map([
                ...createHistoryForUnSavedPage({
                    pageIndex: 3,
                    recordsLength: 2,
                }),
                createHistoryForSavedPage({
                    pageId: 'pid_1',
                    recordsLength: 3,
                }),
                ...createHistoryForUnSavedPage({
                    pageIndex: 7,
                    recordsLength: 3,
                }),
            ]);

            clearHistory({
                history,
                pageId,
                updaterFn,
            });

            const result = updaterFn.mock.calls[0][0];

            expect(result.get(pageId)).toBeUndefined();
            expect(history.get(pageId)).toBeUndefined();
        }
    );
});

describe('setHistory', () => {
    test.each([
        {
            pageId: 'pid_1',
            record: { type: 'PAGE', data: 'history_1' },
        },
        {
            pageId: 'pid_2',
            record: { type: 'PAGE', data: 'history_2' },
        },
        {
            pageId: 'pid_3',
            record: { type: 'PAGE', data: 'history_3' },
        },
    ])('should set new history in initialHistory', ({ pageId, record }) => {
        updaterFn.mockReset();

        setHistory({
            pageId,
            record,
            updaterFn,
            history: initialHistory,
        });

        const result = updaterFn.mock.calls[0][0];
        const { cursor } = result.get(pageId);
        expect(result.get(pageId)).toStrictEqual({
            cursor,
            records: new Map([[cursor, record]]),
        });
    });

    test.each([
        {
            pageId: 'pid_1',
            record: { type: 'PAGE', data: 'history_1' },
        },
        {
            pageId: 'pid_2',
            record: { type: 'PAGE', data: 'history_2' },
        },
        {
            pageId: 'pid_3',
            record: { type: 'PAGE', data: 'history_3' },
        },
    ])('should set new history in existing history', ({ pageId, record }) => {
        updaterFn.mockReset();

        const basicHistory = new Map([
            createHistoryForSavedPage({
                pageId,
                recordsLength: 2,
            }),
        ]);

        setHistory({
            pageId,
            record,
            updaterFn,
            history: basicHistory,
        });

        const result = updaterFn.mock.calls[0][0];
        const { cursor } = result.get(pageId);

        const records = new Map(basicHistory.get(pageId).records);
        records.set(cursor, record);

        expect(result.get(pageId)).toStrictEqual({
            cursor,
            records,
        });
    });

    test.each([
        {
            pageId: 'pid_1',
            record: { type: 'PAGE', data: 'history_1' },
        },
        {
            pageId: 'pid_2',
            record: { type: 'PAGE', data: 'history_2' },
        },
        {
            pageId: 'nid_2',
            record: { type: 'PAGE', data: 'history_3' },
        },
    ])(
        'should set new history along with existing history',
        ({ pageId, record }) => {
            updaterFn.mockReset();

            const history = new Map([
                createHistoryForSavedPage({
                    pageId: 1,
                    recordsLength: 2,
                }),
                ...createHistoryForUnSavedPage({
                    pageIndex: 2,
                    recordsLength: 4,
                }),
            ]);

            setHistory({
                pageId,
                record,
                updaterFn,
                history,
            });

            const result = updaterFn.mock.calls[0][0];
            const { cursor } = result.get(pageId);
            let records;
            const existingRecords =
                history.has(pageId) && history.get(pageId).records;

            if (existingRecords) {
                records = new Map(existingRecords);
                records.set(cursor, record);
            } else {
                records = new Map([[cursor, record]]);
            }

            expect(result.get(pageId)).toStrictEqual({
                cursor,
                records,
            });
        }
    );
});

describe('setHistoryPageId', () => {
    test.each([3, 4, 2, 6])(
        'should add "page-%s" to the history',
        (pageIndex) => {
            updaterFn.mockReset();

            setHistoryPageId({ history: initialHistory, pageIndex, updaterFn });

            const result = updaterFn.mock.calls[0][0];

            expect(result.get(`page-${pageIndex}`)).toBeTruthy();
            expect(initialHistory.get(`page-${pageIndex}`)).toBeFalsy();
        }
    );

    test.each([3, 5, 4])(
        'should keep as it is if "page-%s" is already exist to the history',
        (pageIndex) => {
            updaterFn.mockReset();

            const pagesHistory = new Map([
                ...createHistoryForUnSavedPage({
                    pageIndex: 3,
                }),
                ...createHistoryForUnSavedPage({
                    pageIndex: 4,
                }),
                ...createHistoryForUnSavedPage({
                    pageIndex: 5,
                }),
                createHistoryForSavedPage({
                    pageId: 'pid_1',
                }),
                ...createHistoryForUnSavedPage({
                    pageIndex: 10,
                }),
            ]);

            setHistoryPageId({ history: pagesHistory, pageIndex, updaterFn });

            const result = updaterFn.mock.calls[0][0];

            expect(result.get(`page-${pageIndex}`)).toBe(
                pagesHistory.get(`page-${pageIndex}`)
            );
            expect(pagesHistory.get(`page-${pageIndex}`)).toBe(
                pagesHistory.get(`page-${pageIndex}`)
            );
        }
    );

    test('should called with initial record as an initial record is needed for unsaved page', () => {
        updaterFn.mockReset();
        const pageIndex = 5;

        setHistoryPageId({ history: initialHistory, pageIndex, updaterFn });

        const result = updaterFn.mock.calls[0][0];

        expect(initialHistory.has(`page-${pageIndex}`)).toBeFalsy();

        const nanoId = result.get(`page-${pageIndex}`);
        const { cursor } = result.get(nanoId);
        expect(result.get(nanoId).records.get(cursor)).toStrictEqual({
            data: null,
            type: 'PAGE',
        });
    });

    test('should no be called with initial record as record is already created for unsaved page', () => {
        updaterFn.mockReset();
        const pageIndex = 5;
        const cursorIndex = 1;

        const history = new Map([
            ...createHistoryForUnSavedPage({
                pageIndex,
                recordsLength: 1,
                cursor: `hid_${cursorIndex}`,
            }),
        ]);

        setHistoryPageId({ history, pageIndex, updaterFn });

        const result = updaterFn.mock.calls[0][0];

        const nanoId = result.get(`page-${pageIndex}`);
        const { cursor } = result.get(nanoId);

        expect(result.get(nanoId).records.get(cursor)).not.toStrictEqual({
            data: null,
            type: 'PAGE',
        });
    });
});

describe('updateHistoryPageId', () => {
    test.each([{ pageIndex: 3 }, { pageIndex: 4 }])(
        'should remove "page-$pageIndex" with "pid_$pageIndex" into the cursors of history',
        ({ pageIndex }) => {
            updaterFn.mockReset();
            const newPageId = `pid_${pageIndex}`;
            const pagesHistory = new Map([
                ...createHistoryForUnSavedPage({
                    pageIndex: 3,
                }),
                createHistoryForSavedPage({
                    pageId: 'pid_2',
                }),
                ...createHistoryForUnSavedPage({
                    pageIndex: 4,
                }),
            ]);
            updateHistoryPageId({
                pageIndex,
                updaterFn,
                pageId: newPageId,
                history: pagesHistory,
            });

            const result = updaterFn.mock.calls[0][0];
            const previousNanoId = `nid_${pageIndex}`;

            const previousPageIndexKey = `page-${pageIndex}`;

            expect(pagesHistory.get(previousPageIndexKey)).toBe(previousNanoId);
            expect(result.get(previousPageIndexKey)).toBeUndefined();

            expect(pagesHistory.get(newPageId)).toBeUndefined();

            const { records, cursor } = pagesHistory.get(previousNanoId);
            expect(result.get(newPageId)).toStrictEqual({
                cursor,
                records,
            });
        }
    );

    test.each([1, 5, 7])(
        'should skip replacing if "page-%s" is not exists in history',
        (pageIndex) => {
            updaterFn.mockReset();
            const newPageId = `pid_${pageIndex}`;
            const pagesHistory = new Map([
                [
                    'page-1',
                    {
                        records: new Map(),
                    },
                ],

                [
                    'page-5',
                    {
                        records: new Map(),
                    },
                ],
                [
                    'page-7',
                    {
                        records: new Map(),
                    },
                ],
            ]);
            updateHistoryPageId({
                pageIndex,
                updaterFn,
                pageId: newPageId,
                history: pagesHistory,
            });

            expect(updaterFn).not.toHaveBeenCalled();
        }
    );
});

describe('undo', () => {
    test('should not be called updaterFn', () => {
        updaterFn.mockReset();
        const history = new Map([
            createHistoryForSavedPage({
                index: 1,
                cursor: 'hid_1',
                recordsNumber: 1,
            }),
        ]);

        undo({
            history,
            pageId: 'pid_1',
            updaterFn,
        });

        expect(updaterFn).not.toHaveBeenCalled();
    });

    test('should undo called with previous record', () => {
        updaterFn.mockReset();
        const pageId = 'pid_1';
        const cursorIndex = 2;
        const history = new Map([
            createHistoryForSavedPage({
                pageId,
                cursor: `hid_${cursorIndex}`,
                recordsLength: 2,
            }),
        ]);

        undo({
            pageId,
            history,
            updaterFn,
        });

        const result = updaterFn.mock.calls[0][0];

        expect(result).toMatchObject({
            record: history.get(pageId).records.get(`hid_${cursorIndex - 1}`),
        });
    });

    test('should undo called with previous record (hid_2)', () => {
        updaterFn.mockReset();
        const cursorIndex = 3;
        const pageId = 'pid_1';
        const history = new Map([
            createHistoryForSavedPage({
                pageId,
                recordsLength: 3,
                cursor: `hid_${cursorIndex}`,
            }),

            createHistoryForSavedPage({
                pageId: 'pid_2',
            }),
        ]);

        undo({
            pageId,
            history,
            updaterFn,
        });

        const result = updaterFn.mock.calls[0][0];

        expect(result).toMatchObject({
            record: history.get(pageId).records.get(`hid_${cursorIndex - 1}`),
        });
    });

    test('should not undo called with previous record (hid_2) as pid_2 is not exist to the history', () => {
        updaterFn.mockReset();
        const pageId = 'pid_1';
        const cursorIndex = 2;
        const history = new Map([
            createHistoryForSavedPage({
                pageId,
                recordsLength: 3,
                cursor: `hid_${cursorIndex}`,
            }),
        ]);

        const nonExistPageId = 'pid_2';

        undo({
            history,
            updaterFn,
            pageId: nonExistPageId,
        });

        expect(updaterFn).not.toHaveBeenCalled();
    });

    test('should undo called with previous record (hid_5) with pageIndex 1', () => {
        updaterFn.mockReset();
        const pageIndex = 1;
        const cursorIndex = 3;
        const history = new Map([
            createHistoryForSavedPage({
                pageId: 'pid_1',
                recordsLength: 3,
                cursor: `hid_${cursorIndex}`,
            }),
            ...createHistoryForUnSavedPage({
                pageIndex,
                recordsLength: 3,
                cursor: `hid_${cursorIndex}`,
            }),
        ]);

        undo({
            history,
            pageIndex,
            updaterFn,
        });

        const result = updaterFn.mock.calls[0][0];

        expect(result).toMatchObject({
            record: history
                .get(`nid_${pageIndex}`)
                .records.get(`hid_${cursorIndex - 1}`),
        });
    });

    test('should not undo called with previous record (hid_12) with pageIndex 2 as it is not exist in history', () => {
        updaterFn.mockReset();
        const pageIndex = 1;
        const cursorIndex = 3;

        const history = new Map([
            createHistoryForSavedPage({
                pageId: 'pid_1',
                recordsLength: 3,
                cursor: `hid_${cursorIndex}`,
            }),
            ...createHistoryForUnSavedPage({
                pageIndex,
                recordsLength: 3,
                cursor: `hid_${cursorIndex}`,
            }),
        ]);

        const nonExistPageIndex = 2;

        undo({
            history,
            updaterFn,
            pageIndex: nonExistPageIndex,
        });

        expect(updaterFn).not.toHaveBeenCalled();
    });
});

describe('redo', () => {
    test('should not be called updaterFn', () => {
        updaterFn.mockReset();
        const history = new Map([
            createHistoryForSavedPage({
                pageId: 'pid_1',
                cursor: 'hid_1',
                recordsNumber: 1,
            }),
        ]);

        redo({
            history,
            pageId: 'pid_1',
            updaterFn,
        });

        expect(updaterFn).not.toHaveBeenCalled();
    });

    test('should redo called with next record', () => {
        updaterFn.mockReset();
        const pageId = 'pid_1';
        const cursorIndex = 1;
        const history = new Map([
            createHistoryForSavedPage({
                pageId,
                cursor: `hid_${cursorIndex}`,
                recordsLength: 2,
            }),
        ]);

        redo({
            pageId,
            history,
            updaterFn,
        });

        const result = updaterFn.mock.calls[0][0];

        expect(result).toMatchObject({
            record: history.get(pageId).records.get(`hid_${cursorIndex + 1}`),
        });
    });

    test('should redo called with next record (hid_3)', () => {
        updaterFn.mockReset();
        const pageId = 'pid_1';
        const cursorIndex = 2;
        const history = new Map([
            createHistoryForSavedPage({
                pageId,
                cursor: `hid_${cursorIndex}`,
                recordsLength: 3,
            }),
        ]);

        redo({
            pageId,
            history,
            updaterFn,
        });

        const result = updaterFn.mock.calls[0][0];

        expect(result).toMatchObject({
            record: history.get(pageId).records.get(`hid_${cursorIndex + 1}`),
        });
    });

    test('should not redo called with next record (hid_2) as pid_2 is not exist to the history', () => {
        updaterFn.mockReset();
        const pageId = 'pid_1';
        const cursorIndex = 1;
        const history = new Map([
            createHistoryForSavedPage({
                pageId,
                recordsLength: 2,
                cursor: `hid_${cursorIndex}`,
            }),
        ]);

        const nonExistPageId = 'pid_2';
        redo({
            history,
            updaterFn,
            pageId: nonExistPageId,
        });

        expect(updaterFn).not.toHaveBeenCalled();
    });

    test('should redo called with next record (hid_3) with pageIndex 1', () => {
        updaterFn.mockReset();
        const pageIndex = 1;
        const cursorIndex = 1;
        const history = new Map([
            createHistoryForSavedPage({
                pageId: 'pid_1',
            }),
            ...createHistoryForUnSavedPage({
                pageIndex,
                cursor: `hid_${cursorIndex}`,
                recordsLength: 2,
            }),
        ]);

        redo({
            history,
            pageIndex,
            updaterFn,
        });

        const result = updaterFn.mock.calls[0][0];

        expect(result).toMatchObject({
            record: history
                .get(history.get(`page-${pageIndex}`))
                .records.get(`hid_${pageIndex + 1}`),
        });
    });

    test('should not redo called with next record (hid_2) with pageIndex 2 as it is not exist in history', () => {
        updaterFn.mockReset();
        const pageIndex = 1;
        const cursorIndex = 1;
        const history = new Map([
            createHistoryForSavedPage({
                pageId: 'pid_1',
            }),
            ...createHistoryForUnSavedPage({
                pageIndex,
                cursor: `hid_${cursorIndex}`,
                recordsLength: 2,
            }),
        ]);

        const nonExistPageIndex = 2;

        redo({
            history,
            updaterFn,
            pageIndex: nonExistPageIndex,
        });

        expect(updaterFn).not.toHaveBeenCalled();
    });
});

describe('mock data generator', () => {
    describe('createHistoryForSavedPage', () => {
        test('should create one history', () => {
            const pageId = 'pid_1';
            const cursor = 'hid_1';
            const historyOne = createHistoryForSavedPage({
                cursor,
                pageId,
                recordsLength: 1,
            });

            expect(historyOne).toStrictEqual([
                pageId,
                {
                    cursor,
                    records: new Map([
                        ['hid_1', { type: 'PAGE', data: 'history_1' }],
                    ]),
                },
            ]);
        });

        test('should create tow history', () => {
            const pageId = 'pid_10';
            const cursor = 'hid_10';
            const historyOne = createHistoryForSavedPage({
                cursor,
                pageId,
                recordsLength: 2,
            });

            expect(historyOne).toStrictEqual([
                pageId,
                {
                    cursor,
                    records: new Map([
                        ['hid_1', { type: 'PAGE', data: 'history_1' }],
                        ['hid_2', { type: 'PAGE', data: 'history_2' }],
                    ]),
                },
            ]);
        });

        test('should create three history', () => {
            const pageId = 'pid_20';
            const cursor = 'hid_20';
            const historyOne = createHistoryForSavedPage({
                cursor,
                pageId,
                recordsLength: 3,
            });

            expect(historyOne).toStrictEqual([
                pageId,
                {
                    cursor,
                    records: new Map([
                        ['hid_1', { type: 'PAGE', data: 'history_1' }],
                        ['hid_2', { type: 'PAGE', data: 'history_2' }],
                        ['hid_3', { type: 'PAGE', data: 'history_3' }],
                    ]),
                },
            ]);
        });

        test('should create four history', () => {
            const pageId = 'pid_10';
            const cursor = 'hid_10';
            const historyOne = createHistoryForSavedPage({
                cursor,
                pageId,
                recordsLength: 4,
            });

            expect(historyOne).toStrictEqual([
                pageId,
                {
                    cursor,
                    records: new Map([
                        ['hid_1', { type: 'PAGE', data: 'history_1' }],
                        ['hid_2', { type: 'PAGE', data: 'history_2' }],
                        ['hid_3', { type: 'PAGE', data: 'history_3' }],
                        ['hid_4', { type: 'PAGE', data: 'history_4' }],
                    ]),
                },
            ]);
        });

        test.each([null, 5, 8, undefined])(
            'should create one history if recordsLength is not defined or greater than 4',
            (recordsLength) => {
                const pageId = 'pid_10';
                const cursor = 'hid_10';
                const historyOne = createHistoryForSavedPage({
                    cursor,
                    pageId,
                    recordsLength,
                });

                expect(historyOne).toStrictEqual([
                    pageId,
                    {
                        cursor,
                        records: new Map([
                            ['hid_1', { type: 'PAGE', data: 'history_1' }],
                        ]),
                    },
                ]);
            }
        );
    });

    describe('createHistoryForUnSavedPage', () => {
        test('should create one history', () => {
            const pageIndex = 1;
            const cursor = 'hid_1';
            const historyOne = createHistoryForUnSavedPage({
                cursor,
                pageIndex,
                recordsLength: 1,
            });

            expect(historyOne).toStrictEqual([
                [`page-${pageIndex}`, `nid_${pageIndex}`],
                [
                    `nid_${pageIndex}`,
                    {
                        cursor,
                        records: new Map([
                            ['hid_1', { type: 'PAGE', data: 'history_1' }],
                        ]),
                    },
                ],
            ]);
        });

        test('should create two history', () => {
            const pageIndex = 2;
            const cursor = 'hid_1';
            const historyOne = createHistoryForUnSavedPage({
                cursor,
                pageIndex,
                recordsLength: 2,
            });

            expect(historyOne).toStrictEqual([
                [`page-${pageIndex}`, `nid_${pageIndex}`],
                [
                    `nid_${pageIndex}`,
                    {
                        cursor,
                        records: new Map([
                            ['hid_1', { type: 'PAGE', data: 'history_1' }],
                            ['hid_2', { type: 'PAGE', data: 'history_2' }],
                        ]),
                    },
                ],
            ]);
        });

        test('should create three history', () => {
            const pageIndex = 1;
            const cursor = 'hid_1';
            const historyOne = createHistoryForUnSavedPage({
                cursor,
                pageIndex,
                recordsLength: 3,
            });

            expect(historyOne).toStrictEqual([
                [`page-${pageIndex}`, `nid_${pageIndex}`],
                [
                    `nid_${pageIndex}`,
                    {
                        cursor,
                        records: new Map([
                            ['hid_1', { type: 'PAGE', data: 'history_1' }],
                            ['hid_2', { type: 'PAGE', data: 'history_2' }],
                            ['hid_3', { type: 'PAGE', data: 'history_3' }],
                        ]),
                    },
                ],
            ]);
        });

        test('should create four history', () => {
            const pageIndex = 10;
            const cursor = 'hid_1';
            const historyOne = createHistoryForUnSavedPage({
                cursor,
                pageIndex,
                recordsLength: 4,
            });

            expect(historyOne).toStrictEqual([
                [`page-${pageIndex}`, `nid_${pageIndex}`],
                [
                    `nid_${pageIndex}`,
                    {
                        cursor,
                        records: new Map([
                            ['hid_1', { type: 'PAGE', data: 'history_1' }],
                            ['hid_2', { type: 'PAGE', data: 'history_2' }],
                            ['hid_3', { type: 'PAGE', data: 'history_3' }],
                            ['hid_4', { type: 'PAGE', data: 'history_4' }],
                        ]),
                    },
                ],
            ]);
        });

        test.each([null, undefined, 5, 6])(
            'should create one history if recordsLength is not defined or greater than 4',
            (recordsLength) => {
                const pageIndex = 10;
                const cursor = 'hid_1';
                const historyOne = createHistoryForUnSavedPage({
                    cursor,
                    pageIndex,
                    recordsLength,
                });

                expect(historyOne).toStrictEqual([
                    [`page-${pageIndex}`, `nid_${pageIndex}`],
                    [
                        `nid_${pageIndex}`,
                        {
                            cursor,
                            records: new Map([
                                ['hid_1', { type: 'PAGE', data: 'history_1' }],
                            ]),
                        },
                    ],
                ]);
            }
        );
    });
});

describe('clearUnSavedPagesHistory', () => {
    test('should remove all unsaved pages history', () => {
        updaterFn.mockReset();
        const history = new Map([
            ...createHistoryForUnSavedPage({
                pageIndex: 1,
            }),
            ...createHistoryForUnSavedPage({
                pageIndex: 2,
            }),
        ]);

        clearUnSavedPagesHistory({ history, updaterFn });

        expect(updaterFn).toHaveBeenLastCalledWith(new Map());
    });

    test('should remove all unsaved pages history expect saved pages history', () => {
        updaterFn.mockReset();
        const history = new Map([
            ...createHistoryForUnSavedPage({
                pageIndex: 1,
            }),
            createHistoryForSavedPage({
                pageId: 'pid_1',
            }),
            ...createHistoryForUnSavedPage({
                pageIndex: 2,
            }),
        ]);

        clearUnSavedPagesHistory({ history, updaterFn });

        expect(updaterFn).toHaveBeenLastCalledWith(
            new Map([
                createHistoryForSavedPage({
                    pageId: 'pid_1',
                }),
            ])
        );
    });

    test('should not remove any unsaved pages as there is no history for unsaved pages', () => {
        updaterFn.mockReset();
        const history = new Map([
            createHistoryForSavedPage({
                pageId: 'pid_1',
            }),
            createHistoryForSavedPage({
                pageId: 'pid_2',
            }),
        ]);

        clearUnSavedPagesHistory({ history, updaterFn });

        expect(updaterFn).toHaveBeenLastCalledWith(
            new Map([
                createHistoryForSavedPage({
                    pageId: 'pid_1',
                }),
                createHistoryForSavedPage({
                    pageId: 'pid_2',
                }),
            ])
        );
    });
});
