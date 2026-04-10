import React from 'react';
import { Form } from 'antd';

const defaultRules = [
    {
        required: true,
        whitespace: false,
        message: 'This field is required',
    },
];

export const FieldWrapper = ({ children, rules = defaultRules }) => (
    <Form.Item required rules={rules} name="value" style={{ marginBottom: 12 }}>
        {children}
    </Form.Item>
);
