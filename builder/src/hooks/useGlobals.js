import { useContext, useCallback } from 'react';
import {
    EditorContext,
    ElementContext,
} from '../contexts/ElementRenderContext';

export default function useGlobals() {
    const { global } = useContext(EditorContext);
    const { setGlobalState } = useContext(ElementContext);
    const colors = global?.settings?.colors || [];

    const setColors = useCallback(
        (newColors) => {
            const { settings = {} } = global;
            setGlobalState({ settings: { ...settings, colors: newColors } });
        },
        [setGlobalState, global]
    );
    return { colors, setColors };
}
