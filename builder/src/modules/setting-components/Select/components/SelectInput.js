import { Select as AntSelect, Spin } from 'antd';
import RenderComponentWithLabel from 'modules/Shared/settings-components/RenderComponentWithLabel';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { EditorContext } from '../../../../contexts/ElementRenderContext';
import { getOptionFromSource } from '../utils/select';

/**
 * Renders a select input component using the Ant Design library.
 *
 * @param {Object} props - The props object.
 * @param {string} props.name - The name of the select input.
 * @param {string} props.mode - The mode of the select input. Can be either "regular" or "multiple".
 * @param {string} props.value - The selected value of the select input.
 * @param {string} props.module - The module name.
 * @param {Array} props.options - An array of objects representing the select options.
 * @param {function} props.onChange - A callback function to handle the select input change event.
 * @param {string} props.labelExtra - Extra label text to be displayed.
 * @param {string} props.placeholder - The placeholder text for the select input.
 * @param {string} props.defaultValue - The default value of the select input.
 * @param {function} props.mutateOnChange - A function to mutate the data before calling the onChange callback.
 * @returns {JSX.Element} - The rendered select input component.
 */
const SelectInput = (props) => {
    const {
        name,
        mode,
        value,
        module,
        options,
        onChange,
        labelExtra,
        placeholder,
        label,
        defaultValue,
        mutateOnChange,
    } = props;

    const { currentEditItem } = useContext(EditorContext);
    const { t } = useTranslation('builder');

    const { categories = [] } = currentEditItem || {};

    const handleSelect = (value) => {
        typeof mutateOnChange === 'function'
            ? onChange(mutateOnChange({ name, value }))
            : onChange({ name, value });
    };

    const getOptionsMultiSelect = () => {
        const categoryOptions = [
            ...new Set(
                categories.map(({ label, id }) => ({
                    id,
                    label,
                    value: label,
                }))
            ),
        ];

        return categoryOptions.map(({ label, value, id }) => ({
            id,
            value,
            label,
        }));
    };
    const multiSelectorProp = {
        multiple: {
            mode,
            showArrow: true,
            placeholder: t('Please select'),
            options: options
                ? options.map(
                      ({ name, label = name, value, disabled }, key) => ({
                          key,
                          label: t(label),
                          value,
                          disabled,
                      })
                  )
                : getOptionsMultiSelect(),
        },
        regular: {
            placeholder: t(placeholder) || `${t(`Select`)}..`,
            options: options?.map(
                ({ name, label = name, value, disabled }, key) => ({
                    key,
                    label: t(label),
                    value,
                    disabled,
                })
            ),
        },
        tags: {
            placeholder: t(placeholder) || t(`Select`),
        },
        source: getOptionFromSource({
            currentEditItem,
            key: props.optKey,
            value: props.optVal,
            source: props.source,
        }),
    }[mode || 'regular'];

    return (
        <RenderComponentWithLabel
            {...props}
            labelExtra={labelExtra}
            module={module}
        >
            <AntSelect
                {...props}
                style={{ width: '100%', minWidth: '130px' }}
                size="small"
                value={value || defaultValue}
                onChange={handleSelect}
                {...multiSelectorProp}
                notFoundContent={props.loading ? <Spin size="small" /> : null}
            />
        </RenderComponentWithLabel>
    );
};
export default SelectInput;
