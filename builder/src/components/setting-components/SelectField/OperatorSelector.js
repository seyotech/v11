import React from 'react';
import { Select, Form } from 'antd';

import { useGetOperator } from './useGetOperator';

export const OperatorSelector = ({ type, ignoreOptions }) => {
    const operators = useGetOperator(type, ignoreOptions);

    return (
        <Form.Item
            required
            name="operator"
            rules={[
                {
                    required: true,
                    message: 'This field is a required field',
                },
            ]}
        >
            <Select
                showArrow
                size="middle"
                options={operators}
                style={{ width: '100%' }}
                placeholder="Select filter operator"
            />
        </Form.Item>
    );
};
