import React from 'react';
import { Select } from 'antd';

const AntSelect = ({ options = [], mode, width, onChange, ...props }) => {
    return (
        <Select
            mode={mode}
            allowClear
            onChange={onChange}
            maxTagCount="responsive"
            className="dorik-btn"
            {...props}
        >
            {options.map(({ value, label }, idx) => (
                <Select.Option key={idx} value={value}>
                    {label}
                </Select.Option>
            ))}
        </Select>
    );
};

export default AntSelect;
