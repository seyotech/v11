import styled from 'styled-components';
import React, { useEffect } from 'react';
import { Button, Form, Input, Checkbox, Tooltip } from 'antd';

import usePage from '../../../hooks/usePage';

const AntFormStc = styled(Form)`
    .ant-form-item-label {
        margin: 15px 0;
        font-weight: 400;
        padding: 0;
    }

    .ant-form-item {
        margin-bottom: 0;
    }

    .ant-form-item-explain-error {
        font-size: 12px;
    }
`;

export const PageCreateOrUpdate = ({
    page,
    disabled,
    appName,
    handleOnBlur,
    isSwitchHome,
    handleNameChange,
    handlePageChanges,
    createOrUpdatePage,
}) => {
    const { isSaving } = usePage();
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({ ...page, status: page.status === 'PUBLISHED' });
    }, [form, page]);

    return (
        <AntFormStc
            onFinish={() => createOrUpdatePage(page.pageIndex)}
            form={form}
            colon={false}
            layout="vertical"
            initialValues={{ ...page, status: page.status === 'PUBLISHED' }}
        >
            <Form.Item
                name="name"
                label="Page Name"
                rules={[
                    {
                        required: true,
                        message: 'Page name is required',
                    },
                ]}
            >
                <Input
                    disabled={disabled}
                    placeholder="Page Name"
                    onBlur={() => handleOnBlur(page.pageIndex)}
                    onChange={(e) =>
                        handleNameChange(e.target.value, page.pageIndex)
                    }
                />
            </Form.Item>
            <Form.Item
                name="slug"
                label="Slug"
                required
                rules={[
                    {
                        required: true,
                        whitespace: false,
                    },
                    {
                        pattern: /^\w+/g,
                        message: 'Must start with alphanumeric character',
                    },
                    {
                        pattern: /\w+$/g,
                        message: 'Must end with alphanumeric character',
                    },
                    {
                        pattern: /^((?!(\/){2,}).)*$/g,
                        message: 'Adjacent "/" are not allowed',
                    },
                    {
                        pattern: /^[\w/-]*$/gm,
                        message: 'Allowed special characters are: /, - and _',
                    },
                ]}
            >
                <Input
                    placeholder="Type your slug"
                    onBlur={() => handleOnBlur(page.pageIndex)}
                    onChange={(e) =>
                        handlePageChanges(
                            'slug',
                            e.target.value,
                            page.pageIndex
                        )
                    }
                />
            </Form.Item>
            <div
                style={{
                    marginTop: 20,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Tooltip
                    title={
                        isSwitchHome
                            ? 'Click the Save Button available on the top-right corner.'
                            : null
                    }
                >
                    <Button
                        size="sm"
                        type="primary"
                        htmlType="submit"
                        loading={isSaving}
                        disabled={isSwitchHome}
                    >
                        Save
                    </Button>
                </Tooltip>
            </div>
        </AntFormStc>
    );
};
