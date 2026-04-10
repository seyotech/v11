import { Button, Form, Input, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { CustomInput } from '../imageGenerator.stc';
const { Option } = Select;

const SettingOption = ({ type, defaultValue }) => {
    const { t } = useTranslation('builder');
    const orientation = [
        { label: t('Landscape'), value: 'landscape' },
        { label: t('Portrait'), value: 'portrait' },
        { label: t('Square'), value: 'square' },
    ];
    const style = [
        { label: t('Photo'), value: 'natural' },
        { label: t('Illustration'), value: 'illustration' },
    ];
    const form = Form.useFormInstance();
    const opts = { orientation, style }[type];

    return (
        <Select
            defaultValue={defaultValue}
            style={{ minWidth: 130 }}
            onChange={(value) => form.setFieldValue([type], value)}
        >
            {opts.map(({ value, label }, idx) => (
                <Option key={idx} value={value}>
                    {label}
                </Option>
            ))}
        </Select>
    );
};

function ImageGenerationForm({ disabled, loading }) {
    const { t } = useTranslation('builder');
    return (
        <CustomInput>
            <Form.Item
                style={{ width: '100%' }}
                name="prompt"
                rules={[
                    {
                        required: true,
                        message: t("Command can't be empty"),
                    },
                    {
                        min: 20,
                        message: t(
                            'Command must contain at least 20 character(s)'
                        ),
                    },
                ]}
            >
                <Input
                    addonBefore={
                        <SettingOption type="style" defaultValue="natural" />
                    }
                    addonAfter={
                        <SettingOption
                            type="orientation"
                            defaultValue="square"
                        />
                    }
                    placeholder={t('Type your Image command')}
                />
            </Form.Item>
            <Form.Item hidden={true} name="orientation" />
            <Form.Item hidden={true} name="style" />
            <Button
                disabled={disabled}
                loading={loading}
                type="primary"
                htmlType="submit"
                className="generate-btn"
            >
                {t('Generate')}
            </Button>
        </CustomInput>
    );
}

export default ImageGenerationForm;
