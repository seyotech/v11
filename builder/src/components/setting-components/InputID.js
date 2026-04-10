import React from 'react';
import PrependInput from './PrependInput';

function InputID({ onChange, ...restProps }) {
    const handleChange = ({ name, value }) => {
        value = value.replace(/\s/g, '-');
        onChange({ name, value });
    };
    return <PrependInput {...restProps} onChange={handleChange} />;
}

export default InputID;
