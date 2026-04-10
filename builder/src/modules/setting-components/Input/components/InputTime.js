import { TimePicker } from 'antd';
import dayjs from 'dayjs';

/**
 * Renders a time picker input field.
 * @param {Object} props - The props object.
 * @param {Object} props.data - An object containing the `counter` property with `date` and `time` values.
 * @param {string} props.name - The name of the input field.
 * @param {string} props.label - The label for the input field.
 * @param {function} props.handleOnChange - A function to handle the change event of the input field.
 * @returns {JSX.Element} - A rendered `TimePicker` component.
 */
const InputTime = (props) => {
    const {
        data: { counter: { date, time } = {} },
        name,
        label,
        handleOnChange,
    } = props;
    const timeStr = dayjs(new Date([date, time]));

    const handleChange = (_, value) => {
        const input = { name, value };
        handleOnChange(input);
    };

    return (
        <TimePicker
            size="small"
            value={timeStr}
            allowClear={false}
            data-testid={label}
            defaultValue={timeStr}
            onChange={handleChange}
            style={{ width: '100%' }}
        />
    );
};

export default InputTime;
