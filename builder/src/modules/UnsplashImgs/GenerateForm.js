import { Button, Form, Input, Select } from 'antd';
import { CustomInput } from '../AIImages/imageGenerator.stc';
import { useTranslation } from 'react-i18next';

function GenerationForm({ disabled, loading }) {
    const form = Form.useFormInstance();
    const { t } = useTranslation('builder');
    const orientation = [
        { label: t('Landscape'), value: 'landscape' },
        { label: t('Portrait'), value: 'portrait' },
        { label: t('Square'), value: 'squarish' },
    ];

    return (
        <CustomInput>
            <Form.Item
                style={{ width: '100%' }}
                name="prompt"
                rules={[
                    {
                        required: true,
                        message: t("Search text can't be empty"),
                    },
                    {
                        min: 3,
                        message: t(
                            'Search text must contain at least 3 character(s)'
                        ),
                    },
                ]}
            >
                <Input
                    addonBefore={
                        <Select
                            defaultValue="landscape"
                            style={{ minWidth: 130 }}
                            onChange={(value) =>
                                form.setFieldValue('orientation', value)
                            }
                            options={orientation}
                        />
                    }
                    placeholder={t('Search your Image')}
                />
            </Form.Item>
            <Form.Item hidden={true} name="orientation" />
            <Button
                disabled={disabled}
                loading={loading}
                type="primary"
                htmlType="submit"
                className="generate-btn"
            >
                {t('Search')}
            </Button>
        </CustomInput>
    );
}

export default GenerationForm;
