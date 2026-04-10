import React, { useContext } from 'react';
import CustomSelect, { Option } from './CustomSelect';
import { EditorContext } from '../../contexts/ElementRenderContext';

const ItemSelect = (props) => {
    let { onChange, value, name, options, modContent, source, optKey, optVal } =
        props;
    value = value || modContent?.defaultValue || '';
    options = options || modContent?.options;
    const { currentEditItem } = useContext(EditorContext);

    if (source) {
        const items = source
            .split('/')
            .reduce((acc, cur) => acc[cur], currentEditItem);

        options = items.map((item, i) => ({
            name: item[optKey],
            value: item[optVal] || i,
        }));
    }

    return (
        <CustomSelect selected={value} name={name} onSelect={onChange}>
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

export default ItemSelect;
