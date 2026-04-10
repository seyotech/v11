import { EditorState, Modifier } from 'draft-js';
import { getSelectionCustomInlineStyle } from 'draftjs-utils';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

import { Control } from '../Control';
import { createPlugin } from '../../helpers';
import { toolbarEnum } from '../../../toolbarEnum';

const {
    BOLD,
    CODE,
    COLOR,
    ITALIC,
    ERASER,
    BGCOLOR,
    FONTSIZE,
    UNDERLINE,
    MONOSPACE,
    SUBSCRIPT,
    SUPERSCRIPT,
    FONTFAMILY,
    STRIKETHROUGH,
} = toolbarEnum;

const removeCustomStyles = (obj, callback) => {
    if (obj) {
        for (const key in obj) {
            if ({}.hasOwnProperty.call(obj, key)) {
                callback(key, obj[key]);
            }
        }
    }
};

const Eraser = (props) => {
    const { theme, getEditorState, setEditorState, onToolbarClick } = props;

    const removeInlineStyles = () => {
        const editorState = getEditorState();
        setEditorState(removeAllInlineStyles(editorState));
        onToolbarClick(ERASER);
    };

    const removeAllInlineStyles = (editorState) => {
        let contentState = editorState.getCurrentContent();
        [
            BOLD,
            CODE,
            ITALIC,
            UNDERLINE,
            MONOSPACE,
            SUBSCRIPT,
            SUPERSCRIPT,
            STRIKETHROUGH,
        ].forEach((style) => {
            contentState = Modifier.removeInlineStyle(
                contentState,
                editorState.getSelection(),
                style
            );
        });
        const customStyles = getSelectionCustomInlineStyle(editorState, [
            COLOR,
            BGCOLOR,
            FONTSIZE,
            FONTFAMILY,
        ]);

        removeCustomStyles(customStyles, (key, value) => {
            if (value) {
                contentState = Modifier.removeInlineStyle(
                    contentState,
                    editorState.getSelection(),
                    value
                );
            }
        });

        return EditorState.push(
            editorState,
            contentState,
            'change-inline-style'
        );
    };

    return (
        <Control
            theme={theme}
            onClick={removeInlineStyles}
            icon={icon({ style: 'regular', name: 'eraser' })}
        />
    );
};

export const eraserPlugin = createPlugin({ Component: Eraser });
