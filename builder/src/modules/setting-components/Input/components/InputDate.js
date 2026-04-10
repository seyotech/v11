import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
dayjs.extend(weekday);
dayjs.extend(localeData);

/**
 * Renders a date picker input field.
 * @param {Object} props - The props object.
 * @param {Object} props.data - An object containing the `counter` property, which in turn contains the `date` property.
 * @param {string} props.name - The name of the input field.
 * @param {string} props.label - The label of the input field.
 * @param {function} props.handleOnChange - A function to handle the change event of the input field.
 * @returns {JSX.Element} - The rendered date picker input field.
 */
const InputDate = (props) => {
    const {
        data: { counter: { date } = {} },
        name,
        label,
        handleOnChange,
    } = props;
    const dateFormat = 'YYYY-MM-DD';
    const dateStr = dayjs(date, dateFormat);

    const handleChange = (_, value) => {
        const input = { name, value };
        handleOnChange(input);
    };

    return (
        <DatePicker
            size="small"
            value={dateStr}
            allowClear={false}
            format={dateFormat}
            data-testid={label}
            onChange={handleChange}
            style={{ width: '100%' }}
        />
    );
};

export default InputDate;
