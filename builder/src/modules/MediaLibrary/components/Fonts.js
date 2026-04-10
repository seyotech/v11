import { FontAwesomeIcon } from '@/util/faHelpers';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { Col, Input, Popconfirm, Row, Space, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';

const Fonts = ({ data, handleDeleteMedia }) => {
    const { t } = useTranslation('builder');

    return (
        <Row gutter={[0, 12]}>
            {data.map(({ id, name }) => (
                <Col
                    span={24}
                    style={{ display: 'flex', paddingInline: 0 }}
                    key={id}
                >
                    <Input
                        size="small"
                        readOnly
                        value={name}
                        data-testid={`font-${id}`}
                        prefix={
                            <FontAwesomeIcon
                                style={{ marginRight: '4px' }}
                                icon={icon({
                                    name: 'font',
                                    style: 'solid',
                                })}
                            />
                        }
                    />
                    <Tooltip title={t('Delete font')} placement="right">
                        <Popconfirm
                            title={t('Delete the font')}
                            description={t('Are you sure to delete this font?')}
                            onConfirm={() =>
                                handleDeleteMedia({ id, kind: data.kind })
                            }
                            okText={t('Yes')}
                            cancelText={t('No')}
                            placement="right"
                        >
                            <Space
                                data-testid="delete-icon"
                                style={{
                                    marginLeft: '10px',
                                    cursor: 'pointer',
                                }}
                            >
                                <FontAwesomeIcon
                                    data-testid={`media-font-trash-${id}`}
                                    icon={icon({
                                        name: 'trash',
                                        style: 'regular',
                                    })}
                                />
                            </Space>
                        </Popconfirm>
                    </Tooltip>
                </Col>
            ))}
        </Row>
    );
};

export default Fonts;
