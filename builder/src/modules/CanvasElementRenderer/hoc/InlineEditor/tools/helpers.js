export const createPlugin = ({ Component }) => {
    const store = {
        getEditorState: undefined,
        setEditorState: undefined,
    };

    return {
        initialize: ({ getEditorState, setEditorState }) => {
            store.getEditorState = getEditorState;
            store.setEditorState = setEditorState;
        },
        Component,
    };
};
