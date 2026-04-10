import { useState } from 'react';
import { editorType } from '../util/constant';

function useEditorModal() {
    const initial = JSON.parse(localStorage.getItem('builderPreference')) || {};
    const [builderPreference, setBuilderPreference] = useState({
        editorLayout: editorType.SIDEBAR,
        ...initial,
    });
    const isSidebar = builderPreference.editorLayout === editorType.SIDEBAR;

    const setLocalStorage = (key, value) => {
        setBuilderPreference((prev) => ({ ...prev, [key]: value }));
        window.localStorage.setItem(
            'builderPreference',
            JSON.stringify({ ...initial, [key]: value })
        );
    };

    const handleEditorLayout = (value) => {
        setLocalStorage('editorLayout', value);
    };
    const handleSidebarPosition = (value) => {
        setLocalStorage('sidebarPosition', value);
    };
    const handleFloatModalPosition = (value) => {
        setLocalStorage('floatModalPosition', value);
    };

    return {
        isSidebar,
        ...builderPreference,
        handleEditorLayout,
        handleSidebarPosition,
        handleFloatModalPosition,
    };
}

export default useEditorModal;
