import React from 'react';
import InputGroup from './InputGroup';
import Input from './Input';

function PrependInput({ prefix, hasError, onChange, ...restOfProps }) {
    return (
        <InputGroup {...restOfProps} hasError={hasError} label={prefix}>
            <Input
                size="sm"
                hasError={hasError}
                onChange={onChange}
                {...restOfProps}
            />
        </InputGroup>
    );
}

export default PrependInput;
