import { Col, Form, Row, Select } from 'antd';
import { useTranslation } from 'react-i18next';

function SettingFields() {
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
    return (
        <Row gutter={8}>
            <Col xs={6}>
                <Form.Item
                    style={{ width: '100%' }}
                    name="orientation"
                    label={t('Orientation')}
                >
                    <Select options={orientation} defaultValue="square" />
                </Form.Item>
            </Col>
            <Col xs={6}>
                <Form.Item
                    style={{ width: '100%' }}
                    name="style"
                    label={t('Style')}
                >
                    <Select options={style} defaultValue="natural" />
                </Form.Item>
            </Col>
        </Row>
    );
}

export default SettingFields;
