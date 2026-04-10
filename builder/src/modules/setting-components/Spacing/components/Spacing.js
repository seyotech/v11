/*****************************************************
 * Packages
 ******************************************************/
import { Space, Typography } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
/*****************************************************
 * Locals
 ******************************************************/
import LockButton from 'modules/Shared/settings-components/LockButton';
import RenderComponentWithLabel from 'modules/Shared/settings-components/RenderComponentWithLabel';
import UnitInput from 'modules/Shared/settings-components/UnitInput';
import { useTranslation } from 'react-i18next';

const SpacingStc = styled.div`
    &&&& {
        .labelText {
            color: #a2a1b7;
            display: block;
            width: 100%;
            text-align: center;
        }
    }
`;

const Spacing = (props) => {
    const {
        value,
        options,
        mqValue,
        onChange,
        mqEnabled,
        name: path,
        hoverEnabled,
        defaultValue,
    } = props;
    const [locked, setLock] = useState(false);
    const [lastChanged, setLastChanged] = useState();
    const { t } = useTranslation();

    const altEnabled = mqEnabled || hoverEnabled;
    const original = new Map(value || defaultValue);
    let spacing = original;
    if (mqEnabled) {
        spacing = new Map(mqValue);
    }

    const spacingData = options.map((input) => ({
        ...input,
        value: spacing.get(input.name) || original.get(input.name) || '',
    }));

    const handleChange = (data) => {
        data.forEach((payload) => {
            const { name, value } = payload;
            if (altEnabled && value === '') {
                spacing.delete(name);
            } else {
                spacing.set(name, value);
            }
        });

        // sending data as event mock
        onChange({
            name: path,
            value: Array.from(spacing),
        });
    };

    const handleLock = () => {
        if (!locked && lastChanged) {
            const { value } = lastChanged;
            const lockedData = options.map((item) => ({
                name: item.name,
                value,
            }));
            handleChange(lockedData);
        }
        setLock(!locked);
    };

    const handleInputChange = (payload) => {
        const { value } = payload;
        setLastChanged(payload);
        if (locked) {
            const lockedData = options.map((item) => ({
                name: item.name,
                value,
            }));
            handleChange(lockedData);
        } else {
            handleChange([payload]);
        }
    };

    return (
        <RenderComponentWithLabel
            labelExtra={
                <LockButton isLocked={locked} handleLock={handleLock} />
            }
            {...props}
        >
            <SpacingStc>
                <Space>
                    {spacingData.map((input, index) => (
                        <Space
                            key={index}
                            direction="vertical"
                            data-testid={`${input.name}`}
                        >
                            <UnitInput
                                width="inherit"
                                defaultUnit="px"
                                name={input.name}
                                value={input.value}
                                onChange={handleInputChange}
                            />
                            <Typography.Text
                                className="labelText"
                                ellipsis={true}
                            >
                                {t(input.label)}
                            </Typography.Text>
                        </Space>
                    ))}
                </Space>
            </SpacingStc>
        </RenderComponentWithLabel>
    );
};

export default React.memo(Spacing);
