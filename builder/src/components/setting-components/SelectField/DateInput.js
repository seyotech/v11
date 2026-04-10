import React from 'react';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';

export const DateInput = ({ value, onChange }) => {
    const handleDate = (_, dateStr) => {
        const value = new Date(dateStr).toISOString();
        onChange(value);
    };

    return (
        <DatePicker
            allowClear={false}
            onChange={handleDate}
            style={{ width: '100%' }}
            value={value ? dayjs(value) : ''}
        />
    );
};
