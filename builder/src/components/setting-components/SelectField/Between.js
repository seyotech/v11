import React from 'react';
import { Form, Input, Space } from 'antd';

import { operatorEnum } from '../../../constants/cmsData';

export const Between = () => {
    return (
        <>
            <Space>
                <Input.Group compact style={{ display: 'flex', gap: 12 }}>
                    <Form.Item
                        required
                        label="From"
                        name={['value', operatorEnum.GREATER_THAN]}
                        rules={[
                            {
                                required: true,
                                message: 'This field is required',
                            },
                        ]}
                    >
                        <Input type="number" placeholder="example: 10" />
                    </Form.Item>
                    <Form.Item
                        required
                        label="To"
                        name={['value', operatorEnum.LESS_THAN]}
                        rules={[
                            {
                                required: true,
                                message: 'This field is required',
                            },
                        ]}
                    >
                        <Input type="number" placeholder="example: 100" />
                    </Form.Item>
                </Input.Group>
            </Space>
        </>
    );
};
