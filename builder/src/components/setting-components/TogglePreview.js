import {
    EditorContext,
    ElementContext,
} from '../../contexts/ElementRenderContext';
import React, { useContext } from 'react';
import Switch from './Switch';

function TogglePreview(props) {
    const { handleTogglePreview } = useContext(ElementContext);
    const { previewMapper = {} } = useContext(EditorContext);

    return (
        <Switch
            {...props}
            value={!!previewMapper[props.name]}
            onChange={handleTogglePreview}
        />
    );
}

export default TogglePreview;
