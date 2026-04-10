import { Input } from 'modules/setting-components/Input';

function CFInputLabel({ onChange, name, ...props }) {
    const handleChange = ({ value }) => {
        let preventVal = value.replace(/,/g, '');
        onChange({ name, value: preventVal });
    };
    return <Input {...props} name={name} onChange={handleChange} />;
}

export default CFInputLabel;
