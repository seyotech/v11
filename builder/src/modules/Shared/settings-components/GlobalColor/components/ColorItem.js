import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Popconfirm, Row, Space, Typography } from 'antd';
import {
    Picker as ColorPicker,
} from 'modules/Shared/settings-components/Picker';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const getEllipsisStyle = ({ showEllipsis }) => {
    if (showEllipsis) {
        return {};
    }
    return {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };
};

export const LabelStc = styled(Typography.Text)`
    &&& {
        ${getEllipsisStyle}
        width: 100%;
        margin-top: 0px;
        margin-bottom: 0px;
        & textarea.ant-input {
            max-height: 24px !important;
            min-height: 24px !important;
            left: 12px;
            top: 2px;
            padding: 0px 8px;
            white-space: nowrap;
            &:focus {
                outline: none;
                box-shadow: none;
            }
        }
    }
`;

function ColorItem(props) {
    const {
        type,
        label,
        handleDelete,
        handleChange,
        handleLabelChange,
        item,
        name,
    } = props;
    const [showEllipsis, setShowEllipsis] = useState(false);
    const { t } = useTranslation('builder');

    const Picker = {
        color: ColorPicker,
    }[type];

    useEffect(() => {
        //to fix the lagging issue occuring due to typography ellipsis
        const timedElipse = setTimeout(() => {
            setShowEllipsis(true);
        }, 0);

        // Cleanup function
        return () => clearTimeout(timedElipse);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Row
            data-testid={`colorItem-${name}`}
            justify={'space-between'}
            align={'middle'}
            wrap={false}
            style={{ gap: '14px', width: '100%' }}
        >
            <Col flex={1} style={{ paddingInline: 0 }}>
                <LabelStc
                    {...(showEllipsis && { ellipsis: { tooltip: label } })}
                    showEllipsis={showEllipsis}
                    type={type}
                    editable={{
                        icon: (
                            <FontAwesomeIcon
                                style={{ color: '#747179' }}
                                icon={icon({
                                    name: 'pen-to-square',
                                    style: 'regular',
                                })}
                            />
                        ),
                        tooltip: t('Edit {{type}} name', { type }),
                        text: label,

                        onChange: (value) => {
                            handleLabelChange({
                                name,
                                value,
                            });
                        },
                        enterIcon: null,
                    }}
                    style={{
                        display: 'inline-block',
                        width: '100%',
                    }}
                >
                    {label}
                </LabelStc>
            </Col>
            <Col style={{ paddingInline: 0 }}>
                <Space size={4}>
                    <Picker
                        name={name}
                        value={item.value}
                        onChange={handleChange}
                        isGlobal={true}
                    />

                    <Popconfirm
                        description={t('Are you sure to delete this item?')}
                        onConfirm={() => handleDelete(name)}
                        okText={t('Yes')}
                        cancelText={t('No')}
                        placement="right"
                    >
                        <span
                            style={{ cursor: 'pointer' }}
                            data-testid={`deleteColorItem-${name}`}
                        >
                            <FontAwesomeIcon
                                style={{ color: '#747192' }}
                                icon={icon({
                                    name: 'trash',
                                    style: 'regular',
                                })}
                            />
                        </span>
                    </Popconfirm>
                </Space>
            </Col>
        </Row>
    );
}

export default ColorItem;
