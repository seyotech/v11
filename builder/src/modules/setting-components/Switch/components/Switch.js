import { Switch as AntSwitch } from 'antd';
import RenderComponentWithLabel from 'modules/Shared/settings-components/RenderComponentWithLabel';

/**
 * Renders a switch component.
 * @param {object} props - An object containing various props for the switch component.
 * @param {string} props.name - The name of the switch.
 * @param {string} props.label - The label of the switch.
 * @param {boolean} props.value - The value of the switch.
 * @param {number} props.width - The width of the switch.
 * @param {string} props.onLabel - The label for the 'on' state of the switch.
 * @param {any} props.onValue - The value for the 'on' state of the switch.
 * @param {number} props.labelGap - The gap between the label and the switch.
 * @param {string} props.offLabel - The label for the 'off' state of the switch.
 * @param {any} props.offValue - The value for the 'off' state of the switch.
 * @param {function} props.onChange - The function to be called when the switch value changes.
 * @param {boolean} props.isSidebar - Indicates if the switch is used in a sidebar.
 * @param {number} props.labelWidth - The width of the switch label.
 * @param {any} props.defaultValue - The default value of the switch.
 * @param {string} props.labelPosition - The position of the switch label.
 * @param {function} props.mutateOnChange - A function to mutate the value before calling the onChange function.
 * @param {object} props.module - The module object.
 * @param {object} restOfProps - The remaining props for the switch component.
 * @returns {JSX.Element} The rendered switch component.
 */
export const Switch = (props) => {
    const {
        name,
        label,
        value,
        width,
        onLabel,
        onValue,
        labelGap,
        offLabel,
        offValue,
        onChange,
        isSidebar,
        labelWidth,
        defaultValue,
        labelPosition,
        mutateOnChange,
        module,
        ...restOfProps
    } = props;

    const handleChange = (value) => {
        if (value === true) {
            value = onValue || true;
        } else {
            value = offValue || false;
        }
        typeof mutateOnChange === 'function'
            ? onChange(mutateOnChange({ value, name }))
            : onChange({ value, name });
    };

    let switchVal = value !== undefined ? value === onValue : value;

    // Disable the Switch element based on data value.
    const disabled = restOfProps.data?.disabled ?? false;

    return (
        <RenderComponentWithLabel
            {...props}
            labelExtra={module.labelExtra}
            module={module}
        >
            <AntSwitch
                size="small"
                checked={switchVal}
                disabled={disabled}
                onChange={handleChange}
                data-testid="ant-switch"
                defaultChecked={defaultValue === onValue}
            />
        </RenderComponentWithLabel>
    );
};
