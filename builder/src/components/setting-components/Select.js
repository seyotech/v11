import React from 'react';
import useEditorModal from '../../hooks/useEditorModal';
import CustomSelect, { Option } from './CustomSelect';

const Select = (props) => {
    let {
        name,
        value,
        options,
        onChange,
        modContent,
        defaultValue,
        mutateOnChange,
    } = props;

    options = options || modContent?.options;
    value = value || defaultValue || modContent?.defaultValue || '';
    const { isSidebar } = useEditorModal();

    const handleSelect = (input) => {
        typeof mutateOnChange === 'function'
            ? onChange(mutateOnChange(input))
            : onChange(input);
    };
    return (
        <CustomSelect
            name={name}
            selected={value}
            isSidebar={isSidebar}
            onSelect={handleSelect}
        >
            {options.map((option, index) => (
                <Option
                    key={index}
                    value={option.value}
                    disabled={option.disabled}
                >
                    {option.name}
                </Option>
            ))}
        </CustomSelect>
    );
};
export default Select;
