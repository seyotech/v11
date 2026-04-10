import React, { useContext } from 'react';
import { EditorContext } from '../../contexts/ElementRenderContext';
import useCMSRow from '../../hooks/useCmsRow';
import Select from './Select';

function LinkTypeSelect(props) {
    let modifiedOpts = [...props.options];
    const { page: { ref } = {} } = useContext(EditorContext);
    const { cmsRowAddr } = useCMSRow();
    if (cmsRowAddr || ref) {
        modifiedOpts.push({ name: 'CMS item slug', value: 'cms-itemSlug' });
    }
    return <Select {...props} options={modifiedOpts} />;
}

export default LinkTypeSelect;
