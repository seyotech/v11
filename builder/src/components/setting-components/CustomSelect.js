/*****************************************************
 * Packages
 ******************************************************/
import React from 'react';
import PropTypes from 'prop-types';
import { SelectNative } from './CustomSelect.stc';

export const Option = (props) => {
    const { children, value, disabled } = props;
    return (
        <option value={value} disabled={disabled}>
            {children}
        </option>
    );
};

const Select = (props) => {
    const { children, onSelect, name, selected, ...rest } = props;
    const handleSelect = (e) => {
        e.persist();
        const result = { name, value: e.target.value };
        onSelect && onSelect(result);
    };
    return (
        <SelectNative value={selected} onChange={handleSelect} {...rest}>
            {children}
        </SelectNative>
    );
};

Select.propTypes = {
    onSelect: PropTypes.func,
};

export default React.memo(Select);
