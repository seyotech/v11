import { Input } from 'antd';

const { TextArea } = Input;
/**
 * Renders an Ant Design TextArea component.
 * @param {Object} props - The component props.
 * @param {string} props.value - The current value of the TextArea.
 * @param {string} props.label - The label for the TextArea, used as the data-testid attribute.
 * @param {string} props.name - The name of the TextArea input.
 * @param {string} props.placeholder - The placeholder text for the TextArea.
 * @param {string} props.disabled - The disabled flag for for the TextArea.
 * @param {string} props.defaultValue - The default value for the TextArea if no value is provided.
 * @param {function} props.handleOnChange - A callback function to handle changes in the TextArea input.
 * @returns {JSX.Element} - The rendered Ant Design TextArea component.
 */
const InputTextArea = (props) => {
    const { value, label, name, placeholder, defaultValue, handleOnChange } =
        props;

    const handleChange = ({ target: { value } }) => {
        const input = { name, value };
        handleOnChange(input);
    };

    return (
        <TextArea
            rows={8}
            value={value}
            data-testid={label}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={props.disabled}
            defaultValue={defaultValue || value}
        />
    );
};

export default InputTextArea;
