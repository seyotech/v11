import React from 'react';
import { Checkbox, Row, Col } from 'antd';

const AntCheckbox = ({ value, options = [], width, ...props }) => {
    return (
        <Checkbox.Group
            {...props}
            style={{ width: '100%' }}
            defaultValue={value}
        >
            <Row>
                {options.map(({ label, value }) => (
                    <Col span={width || 24} key={value}>
                        <Checkbox value={value}>{label}</Checkbox>
                    </Col>
                ))}
            </Row>
        </Checkbox.Group>
    );
};

export default AntCheckbox;
