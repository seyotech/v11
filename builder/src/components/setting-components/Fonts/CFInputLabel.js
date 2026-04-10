import React from 'react';
import Input from '../Input';

function CFInputLabel({ onChange, name, ...props }) {
    const handleChange = ({ value }) => {
        let preventVal = value.replace(/,/g, '');
        onChange({ name, value: preventVal });
    };
    return (
        <div>
            <Input {...props} name={name} onChange={handleChange} />
        </div>
    );
}

export default CFInputLabel;
