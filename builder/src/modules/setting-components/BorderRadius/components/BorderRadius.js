/*****************************************************
 * Packages
 ******************************************************/
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row, Space } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';

/*****************************************************
 * Locals
 ******************************************************/

import LockButton from 'modules/Shared/settings-components/LockButton';
import RenderComponentWithLabel from 'modules/Shared/settings-components/RenderComponentWithLabel';
import UnitInput from 'modules/Shared/settings-components/UnitInput';

/*****************************************************
 * Styles
 ******************************************************/
const BorderRadiusStc = styled.div`
    &&& .previewCol {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 4rem;
        border: 1px solid #3830b3;
        cursor: pointer;
        & button {
            width: 100%;
            height: 100%;
            &:hover {
                background-color: transparent;
            }
        }
    }
`;

const BorderRadius = (props) => {
    let { name, value, onChange } = props;
    // assign default value
    value = !value ? `0px 0px 0px 0px` : value;

    const [locked, setLock] = useState(false);
    const [lastChanged, setLastChanged] = useState();
    const [topLeft, topRight, bottomRight, bottomLeft] = value.split(' ');
    const state = { topLeft, topRight, bottomRight, bottomLeft };

    const handleLock = () => {
        if (!locked && lastChanged) {
            onChange({
                name,
                value: `${lastChanged} `.repeat(4).trim(),
            });
        }
        setLock(!locked);
    };

    const handleChange = (payload) => {
        const { value, name: inputName } = payload;
        setLastChanged(value);
        if (locked) {
            onChange({
                name,
                value: `${value} `.repeat(4).trim(),
            });
            return;
        }
        onChange({
            name,
            value: Object.values({ ...state, [inputName]: value }).join(' '),
        });
    };

    const inputItems = [
        {
            name: 'topLeft',
            labelIconProps: {
                icon: icon({
                    name: 'border-top-left',
                    style: 'solid',
                }),
            },
        },
        {
            name: 'topRight',
            labelIconProps: {
                icon: icon({
                    name: 'border-top-left',
                    style: 'solid',
                }),
                flip: 'horizontal',
            },
        },
        {
            name: 'bottomLeft',
            labelIconProps: {
                icon: icon({
                    name: 'border-bottom-right',
                    style: 'solid',
                }),
                flip: 'horizontal',
            },
        },
        {
            name: 'bottomRight',
            labelIconProps: {
                icon: icon({
                    name: 'border-bottom-right',
                    style: 'solid',
                }),
            },
        },
    ];

    return (
        <RenderComponentWithLabel {...props}>
            <BorderRadiusStc>
                <Space align={'middle'}>
                    <div
                        data-testid="previewCol"
                        className="previewCol"
                        style={{ borderRadius: value }}
                    >
                        <LockButton isLocked={locked} handleLock={handleLock} />
                    </div>
                    <Row gutter={[8, 8]}>
                        {inputItems.map(({ name, labelIconProps }, index) => (
                            <Col
                                key={index}
                                span={12}
                                data-testid={`${name}-group`}
                            >
                                <UnitInput
                                    width="inherit"
                                    prefix={
                                        <FontAwesomeIcon
                                            {...labelIconProps}
                                            data-testid={`${name}-icon`}
                                            style={{
                                                color: '#a2a1b7',
                                                // fontSize: '.75rem',
                                            }}
                                        />
                                    }
                                    defaultUnit="px"
                                    name={name}
                                    value={state[name]}
                                    onChange={handleChange}
                                />
                            </Col>
                        ))}
                    </Row>
                </Space>
            </BorderRadiusStc>
        </RenderComponentWithLabel>
    );
};
export default BorderRadius;
