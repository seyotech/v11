import { EditorContext, ElementContext } from 'contexts/ElementRenderContext';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import SelectInput from './SelectInput';

/**
 * Renders a select input component with options generated from the `content` array in the `EditorContext` and the `symbols` object in the `ElementContext`.
 *
 * @param {object} props - The properties for configuring the select input component.
 * @param {string} props.name - The name of the select input.
 * @param {string} props.value - The selected value of the select input.
 * @param {function} props.onChange - The onChange event handler for the select input.
 * @returns {JSX.Element} The rendered SelectInput component.
 */
function PopupModalSelect(props) {
    const { name, value, onChange } = props;
    const { currentPage: { data: { content = [] } = {} } = {} } =
        useContext(EditorContext);
    const { symbols } = useContext(ElementContext);
    const { t } = useTranslation('builder');

    const symbolSectionParsed = content
        ?.map((item) => {
            if (!item?.symbolId) return item;
            if (symbols[item.symbolId]?.data) {
                return (item = symbols[item.symbolId].data);
            }
        })
        .filter(Boolean);

    const popupRowsOpts = symbolSectionParsed
        ?.flatMap(({ content = [] }) =>
            // temporary solution. need to debug why content is null
            content?.map((item) => {
                if (!item) return;
                if (item.symbolId && symbols[item.symbolId]?.data) {
                    item = symbols[item.symbolId].data;
                }
                const { attr = {}, settings = {} } = item;
                if (settings.popup) {
                    return {
                        value: attr.id,
                        name: attr.id,
                    };
                }
            })
        )
        ?.filter((v) => v);

    const handleChange = ({ value }) => {
        onChange({ name, value });
    };

    return (
        <SelectInput
            onChange={handleChange}
            value={value}
            options={[{ name: t('None'), value: '' }, ...popupRowsOpts]}
            {...props}
        />
    );
}

export default PopupModalSelect;
