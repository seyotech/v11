import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Radio, Tooltip } from 'antd';
import RenderComponentWithLabel from 'modules/Shared/settings-components/RenderComponentWithLabel';
import { useTranslation } from 'react-i18next';

/**
 * Renders a group of radio buttons with labels and icons.
 * Allows the user to select one option from a list of options.
 *
 * @param {Object} props - The props object.
 * @param {string} props.name - The name of the radio button group.
 * @param {string} props.value - The currently selected value.
 * @param {string} props.module - The module name.
 * @param {Array} props.options - An array of objects representing the available options for the radio buttons.
 * @param {Function} props.onChange - A callback function to be called when the selected value changes.
 * @param {string} props.inputType - The type of input element to render.
 * @param {string} props.labelExtra - An extra label to be displayed alongside the radio button group.
 * @param {string} props.defaultValue - The default value for the radio button group.
 * @param {Function} props.mutateOnChange - A function to be called to mutate the payload before calling the onChange function.
 * @returns {JSX.Element} The rendered radio button group component.
 */
export const Tabs = (props) => {
    const {
        name,
        value,
        module,
        options,
        onChange,
        inputType,
        labelExtra,
        defaultValue,
        mutateOnChange,
    } = props;
    const { t } = useTranslation();

    // Set the selected value to the current value if defined, otherwise set it to the default value
    const selected = value === undefined ? defaultValue : value;

    // Handle the change event of the radio buttons
    const handleChange = (event) => {
        const payload = { name, value: event.target.value };
        typeof mutateOnChange === 'function'
            ? onChange(mutateOnChange(payload))
            : onChange(payload);
    };

    // Map over the options array to create an array of objects representing the radio button items
    const items = options.map((option, index) => {
        const {
            value,
            label,
            icon,
            tooltipPosition = 'top',
            style = {},
        } = option;

        // If the icon property is a string, wrap the label in a Tooltip component with the specified tooltipPosition
        // and display the FontAwesomeIcon with the specified icon. Otherwise, display the label directly.
        const itemLabel =
            icon && typeof icon === 'string' ? (
                <Tooltip
                    placement={tooltipPosition}
                    title={t(label)}
                    data-testid={`${icon.split(' ')[0]}`}
                >
                    <FontAwesomeIcon
                        className="icon"
                        data-testid={`icon-${icon.split(' ')[1]}-${index}`}
                        icon={icon.split(' ')}
                    />
                </Tooltip>
            ) : (
                t(label)
            );

        return {
            key: index,
            value,
            style: { ...style, flexGrow: 1, textAlign: 'center' },
            label: itemLabel,
        };
    });

    return (
        <RenderComponentWithLabel
            {...props}
            labelExtra={labelExtra}
            module={module}
        >
            <Radio.Group
                size="small"
                options={items}
                value={selected}
                optionType="button"
                onChange={handleChange}
                defaultValue={selected}
                style={{ display: 'flex', width: '100%' }}
            />
        </RenderComponentWithLabel>
    );
};
