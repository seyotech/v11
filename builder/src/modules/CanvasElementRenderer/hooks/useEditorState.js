import { useState } from 'react';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, ContentState } from 'draft-js';

export const useEditorState = (value) => {
    const convertToEditorState = (value) => {
        const blocksFromHtml = htmlToDraft(value);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(
            contentBlocks,
            entityMap
        );

        return EditorState.createWithContent(contentState);
    };

    const [editorState, setEditorState] = useState(() =>
        convertToEditorState(value)
    );

    const updateEditorState = (value) => {
        const editorState =
            typeof value === 'string' ? convertToEditorState(value) : value;
        setEditorState(editorState);
    };

    return [editorState, updateEditorState];
};
