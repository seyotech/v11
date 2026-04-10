import React from 'react';
import { Input, Form } from 'antd';

const ElementSearch = ({ form, handleSearch }) => {
    return (
        <div style={{ padding: '20px 30px', background: '#fff' }}>
            <Form
                form={form}
                onFinish={({ search }) => handleSearch(search)}
                onValuesChange={({ search }) => handleSearch(search)}
            >
                <Form.Item name="search">
                    <Input.Search
                        allowClear
                        size="large"
                        enterButton
                        onSearch={handleSearch}
                        placeholder="Search Element"
                    />
                </Form.Item>
            </Form>
        </div>
    );
};

export default ElementSearch;
