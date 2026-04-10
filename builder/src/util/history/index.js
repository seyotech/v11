import uniqId from '../uniqId';

export const getClonedHistory = (history) => {
    const clonedHistory = new Map();

    for (const [key, value] of history) {
        if (typeof value === 'string') {
            clonedHistory.set(key, value);
        } else {
            const { records, cursor } = value;
            clonedHistory.set(key, { records: new Map(records), cursor });
        }
    }

    return clonedHistory;
};

const getHistoryState = ({ history, pageId, pageIndex }) => {
    const id = history.get(`page-${pageIndex}`) || pageId;

    if (!id || !history.has(id)) {
        return {};
    }

    const { records, cursor } = history.get(id);
    const recordsKeys = Array.from(records.keys());
    const currentIndex = recordsKeys.indexOf(cursor);

    if (currentIndex === -1) {
        return {};
    }

    const previous = recordsKeys[currentIndex - 1];
    const next = recordsKeys[currentIndex + 1];

    return {
        next,
        key: id,
        previous,
        current: cursor,
    };
};

const clearUnSavedPagesHistory = ({ history, updaterFn }) => {
    const clonedHistory = getClonedHistory(history);

    for (const key of Array.from(clonedHistory.keys())) {
        let unsavedPageKeyIndex;
        if ((unsavedPageKeyIndex = key.match(/page-(\d+)/)?.at(1))) {
            const unSavedPageKey = `page-${unsavedPageKeyIndex}`;
            const unSavedPageId = clonedHistory.get(unSavedPageKey);

            clonedHistory.delete(unSavedPageKey);
            clonedHistory.delete(unSavedPageId);
        }
    }

    updaterFn(clonedHistory);
};

const clearHistory = ({ history, pageId, pageIndex, updaterFn }) => {
    const unSavedPageKey = `page-${pageIndex}`;
    const id = pageId || history.get(unSavedPageKey);
    const clonedHistory = getClonedHistory(history);
    clonedHistory.delete(id);

    for (const key of Array.from(clonedHistory.keys())) {
        let unsavedPageKeyIndex;
        if (
            (unsavedPageKeyIndex = key.match(/page-(\d+)/)?.at(1)) >= pageIndex
        ) {
            const previousUnSavedPageKey = `page-${unsavedPageKeyIndex - 1}`;
            const unSavedPageId = clonedHistory.get(
                `page-${unsavedPageKeyIndex}`
            );

            if (unsavedPageKeyIndex != pageIndex) {
                clonedHistory.set(previousUnSavedPageKey, unSavedPageId);
            }
            clonedHistory.delete(`page-${unsavedPageKeyIndex}`);
        }
    }

    updaterFn(clonedHistory);
};

const setHistory = ({ record, history, pageId, updaterFn } = {}) => {
    try {
        const key = uniqId();
        const clonedHistory = getClonedHistory(history);

        if (!clonedHistory.has(pageId)) {
            clonedHistory.set(pageId, { records: new Map() });
        }

        const currentPageHistory = clonedHistory.get(pageId);
        currentPageHistory.records.set(key, record);
        currentPageHistory.cursor = key;

        updaterFn(clonedHistory);
    } catch (error) {
        throw new Error('An error occurred when saving history');
    }
};

const setHistoryPageId = ({ history, updaterFn, pageIndex }) => {
    const clonedHistory = getClonedHistory(history);
    const pageId = uniqId();

    if (!clonedHistory.has(`page-${pageIndex}`)) {
        clonedHistory.set(`page-${pageIndex}`, pageId);

        setHistory({
            pageId,
            updaterFn,
            history: clonedHistory,
            record: { type: 'PAGE', data: null },
        });
    } else {
        updaterFn(clonedHistory);
    }
};

const updateHistoryPageId = ({ pageId, history, updaterFn, pageIndex }) => {
    const clonedHistory = getClonedHistory(history);
    const historyPageId = clonedHistory.get(`page-${pageIndex}`);

    if (!historyPageId) {
        return updaterFn(clonedHistory);
    }

    if (!clonedHistory.has(historyPageId)) return;

    const { records, cursor } = clonedHistory.get(historyPageId);
    clonedHistory.set(pageId, { cursor, records: new Map(records) });
    clonedHistory.delete(historyPageId);
    clonedHistory.delete(`page-${pageIndex}`);

    updaterFn(clonedHistory);
};

const undo = ({ pageId, history, pageIndex, updaterFn }) => {
    const clonedHistory = getClonedHistory(history);
    const { previous, key } = getHistoryState({
        pageId,
        pageIndex,
        history: clonedHistory,
    });

    if (!previous) {
        return;
    }

    const currentPageHistory = clonedHistory.get(key);
    currentPageHistory.cursor = previous;
    const previousRecord = currentPageHistory.records.get(previous);

    updaterFn({ record: previousRecord, history: clonedHistory });
};

const redo = ({ pageId, history, pageIndex, updaterFn }) => {
    const clonedHistory = getClonedHistory(history);
    const { next, key } = getHistoryState({
        pageId,
        pageIndex,
        history: clonedHistory,
    });

    if (!next) {
        return;
    }

    const currentPageHistory = clonedHistory.get(key);
    currentPageHistory.cursor = next;
    const nextRecord = currentPageHistory.records.get(next);

    updaterFn({ record: nextRecord, history: clonedHistory });
};

export {
    undo,
    redo,
    setHistory,
    clearHistory,
    getHistoryState,
    setHistoryPageId,
    updateHistoryPageId,
    clearUnSavedPagesHistory,
};
