import { EditorContext } from 'contexts/ElementRenderContext';
import useCMSRow from 'hooks/useCmsRow/useCmsRow';
import { useContext } from 'react';
import SelectInput from './SelectInput';

/**
 * This function takes in a `props` object and modifies the `options` array in the `props` object based on certain conditions.
 * It returns a `SelectInput` component with the modified options.
 *
 * @param {object} props - An object containing the input properties for the `LinkTypeSelect` component.
 * @param {array} props.options - An array of objects representing the available options for the select input.
 * @returns {JSX.Element} - A `SelectInput` component with the modified options.
 */
function LinkTypeSelect(props) {
    let modifiedOpts = [...props.options];
    const { page: { ref } = {} } = useContext(EditorContext);
    const { cmsRowAddr } = useCMSRow();
    if (cmsRowAddr || ref) {
        modifiedOpts.push({ name: 'CMS item slug', value: 'cms-itemSlug' });
    }
    return <SelectInput {...props} options={modifiedOpts} />;
}

export default LinkTypeSelect;
