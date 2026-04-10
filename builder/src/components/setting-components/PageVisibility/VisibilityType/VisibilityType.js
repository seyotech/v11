import { Form, Select } from 'antd';
import React, { useContext } from 'react';

import { ElementContext } from '../../../../contexts/ElementRenderContext';

export const visibilityOptions = [
    {
        label: 'Public',
        value: 'PUBLIC',
    },
    {
        label: 'Members Only',
        value: 'FREE',
    },
    {
        label: 'Paid Members Only',
        value: 'PAID',
    },
];

const VisibilityType = () => {
    const { handlePageVisibility } = useContext(ElementContext);
    const [visibilityType, setPageVisibility] = handlePageVisibility();

    return (
        <Form.Item
            label="Page Access"
            name="visibilityType"
            labelCol={{ span: 24 }}
            tooltip="Choose who will have full access"
        >
            <Select
                size="large"
                options={visibilityOptions}
                onChange={setPageVisibility}
                defaultValue={visibilityType}
            />
        </Form.Item>
    );
};

export default VisibilityType;
