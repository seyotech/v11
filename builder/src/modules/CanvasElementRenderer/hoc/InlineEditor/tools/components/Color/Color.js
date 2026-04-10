import EditorUtils from '@draft-js-plugins/utils';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

import { Control } from '../Control';
import { createPlugin } from '../../helpers';
import { ColorContent } from './ColorContent';

const Color = ({ getEditorState, theme, onOverrideContent }) => {
    const handleAddGlobalColor = () => {
        onOverrideContent(ColorContent);
    };

    const editorState = getEditorState?.();
    const isGlobalColorActive = editorState
        ? EditorUtils.hasEntity(editorState, 'COLOR')
        : false;

    return (
        <Control
            theme={theme}
            onClick={handleAddGlobalColor}
            isActive={isGlobalColorActive}
            icon={icon({ style: 'regular', name: 'paintbrush-pencil' })}
        />
    );
};

export const colorPlugin = createPlugin({ Component: ColorContent });
