const getListInfo = ({ item, name }) => {
    const listRegex =
        /(?<listPath>(?:\w\/?)+)\/(?<index>\d+)\/(?<itemPath>\w+)/gm;

    const match = listRegex.exec(name);

    if (!match || !match.groups) {
        return {};
    }

    const { listPath, index, itemPath } = match.groups;

    const list =
        listPath.split('/').reduce((acc, key) => {
            return acc[key];
        }, item) || [];

    return { list, index: Number(index), itemPath, listPath };
};

export const getEditorContent = ({ name, item }) => {
    if (!name.includes('/')) {
        return item[name];
    }
    const { list, index, itemPath } = getListInfo({ item, name });
    return list[index]?.[itemPath];
};

export const generatePayload = (name, item, value) => {
    try {
        if (!name.includes('/')) {
            return { name, value };
        }

        const { list, index, itemPath, listPath } = getListInfo({ item, name });
        const updatedItem = { ...list[index], [itemPath]: value };
        const updatedList = [
            ...list.slice(0, index),
            updatedItem,
            ...list.slice(index + 1),
        ];

        return {
            name: listPath,
            value: updatedList,
        };
    } catch (error) {
        throw new Error(
            `Error while processing InlineEditor payload: ${error.message}`
        );
    }
};

export const calculateTranslatePosition = (element) => {
    const { left, right } = element.getBoundingClientRect();

    return window.innerWidth - right <= 160 ? -160 : left <= 160 ? 160 : 0;
};

export const isAllowedEnter = (editorState) => {
    const startKey = editorState.getSelection().getStartKey();
    const selectedBlockType = editorState
        .getCurrentContent()
        .getBlockForKey(startKey)
        .getType();

    const allowedBlockTypes = ['unordered-list-item', 'ordered-list-item'];

    return allowedBlockTypes.includes(selectedBlockType);
};
