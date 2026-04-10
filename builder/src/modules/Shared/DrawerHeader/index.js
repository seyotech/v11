import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Form, Input, Row, Space, Typography } from 'antd';
import { ElementContext } from 'contexts/ElementRenderContext';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const DrawerHeaderStc = styled.div`
    & .ant-col {
        padding-inline: 0 !important;
    }
`;

const DrawerHeader = ({ title, onChange, children, extra, defaultSearch }) => {
    const { handleDrawer } = useContext(ElementContext);
    const { t } = useTranslation('builder');

    return (
        <DrawerHeaderStc>
            <Row
                align="middle"
                gutter={[12, 12]}
                justify="space-between"
                style={{ padding: '0 12px', marginInline: 0 }}
            >
                <Col span={24} />
                <Col>
                    <Typography.Text style={{ fontSize: 16 }} strong>
                        {title}
                    </Typography.Text>
                </Col>
                <Col>
                    <Space>
                        {extra}
                        <Typography.Text>
                            <FontAwesomeIcon
                                style={{
                                    marginRight: 6,
                                    cursor: 'pointer',
                                    height: 14,
                                    width: 14,
                                }}
                                icon={icon({ name: 'times', type: 'regular' })}
                                onClick={() => handleDrawer({ isOpen: false })}
                            />
                        </Typography.Text>
                    </Space>
                </Col>
                {children}
                {!!onChange && (
                    <Col span={24}>
                        <Form.Item name="search" noStyle>
                            <Input.Search
                                size="small"
                                onChange={onChange}
                                placeholder={t('Search')}
                            />
                        </Form.Item>
                    </Col>
                )}

                <Col span={24} />
            </Row>
        </DrawerHeaderStc>
    );
};

DrawerHeader.propTypes = {
    title: PropTypes.string.isRequired,
    onChange: PropTypes.func,
};

export default DrawerHeader;
