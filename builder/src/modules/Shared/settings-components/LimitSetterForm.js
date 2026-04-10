import { Flex, Form, InputNumber, Typography } from 'antd';
import debounce from 'lodash/debounce';
import styled from 'styled-components';
import UnitInputStc from 'modules/Shared/settings-components/UnitInput.stc';

const LimitSetterFormStc = styled(UnitInputStc)`
    &&&&& {
        .inputNumber {
            width: inherit;
        }
        .ant-form-item,
        .ant-form-item-label {
            margin: 0;
            padding: 0;
        }
        .ant-form-item-label > label {
            font-weight: normal;
        }
    }
`;

const LimitSetterForm = ({ data, onChange, t }) => {
    const { min, max } = data || {};

    const { useForm, useWatch } = Form;

    const [form] = useForm();

    const handleChange = debounce(async (_, allValues) => {
        try {
            await form.validateFields();

            onChange([
                { name: 'min', value: allValues.min },
                { name: 'max', value: allValues.max },
            ]);
        } catch (error) {
            console.log({ error });
        }
    }, 500);

    return (
        <LimitSetterFormStc>
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    min,
                    max,
                }}
                onValuesChange={handleChange}
            >
                <Flex gap={10}>
                    <Form.Item
                        label={
                            <Typography.Text>{t('Limit min.')}</Typography.Text>
                        }
                        required={true}
                        name="min"
                        rules={[
                            {
                                required: true,
                                message: t('Min. value is required!'),
                            },
                        ]}
                    >
                        <InputNumber size="small" className="inputNumber" />
                    </Form.Item>
                    <Form.Item
                        label={
                            <Typography.Text>{t('Limit max.')}</Typography.Text>
                        }
                        required={true}
                        name="max"
                        rules={[
                            {
                                required: true,
                                message: t('Max. value is required!'),
                            },
                        ]}
                    >
                        <InputNumber size="small" className="inputNumber" />
                    </Form.Item>
                </Flex>
            </Form>
        </LimitSetterFormStc>
    );
};

export default LimitSetterForm;
