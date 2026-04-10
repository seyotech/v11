import { getDefaultKeyBinding } from 'draft-js';
import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar';

import {
    linkPlugin,
    colorPlugin,
    eraserPlugin,
} from '../hoc/InlineEditor/tools';
import { useMemo } from 'react';

export const useInlineToolbar = () => {
    const inlineToolbarPlugin = useMemo(() => createInlineToolbarPlugin(), []);
    const { InlineToolbar } = inlineToolbarPlugin;
    const plugins = [
        linkPlugin,
        colorPlugin,
        eraserPlugin,
        inlineToolbarPlugin,
        getDefaultKeyBinding,
    ];
    return {
        plugins,
        InlineToolbar,
    };
};
