import { Button, Popover, Divider, Space } from 'antd';
import React, { useState } from 'react';

import { Range } from 'modules/setting-components/Range';

const containerSizes = [
    12.5, 14.29, 16.67, 20, 25, 28.57, 33.33, 37.5, 40, 42.86, 50, 57.14, 60,
    62.5, 66.67, 71.43, 75, 80, 83.33, 85.71, 87.5, 100,
];

const ContainerDropdown = ({ onChange, selectedContainer }) => {
    const numberOfColumns = 3;
    const columns = containerSizes.reduce(
        (acc, size, index) => {
            const columnIndex = index % numberOfColumns;
            acc[columnIndex].push(size);
            return acc;
        },
        Array.from({ length: numberOfColumns }, () => [])
    );
    return (
        <Space
            align="start"
            split={
                <Divider
                    type="vertical"
                    style={{
                        height: '248px',
                    }}
                />
            }
            size={0}
        >
            {columns.map((column, columnIndex) => (
                <Space key={columnIndex} size="small" direction={'vertical'}>
                    {column.map((size) => {
                        return (
                            <Button
                                ghost
                                key={size}
                                size="small"
                                block={true}
                                onClick={() => onChange(`${size}%`)}
                                type={
                                    size == selectedContainer
                                        ? 'primary'
                                        : 'text'
                                }
                            >
                                <small>{size}%</small>
                            </Button>
                        );
                    })}
                </Space>
            ))}
        </Space>
    );
};

export const ContainerSize = (props) => {
    const [open, setOpen] = useState();
    const { onChange, name, value } = props;

    const handleOnChange = (value) => {
        onChange({ name, value });
        setOpen(false);
    };

    return (
        <Popover
            open={open}
            arrow={false}
            placement="bottomRight"
            overlayInnerStyle={{
                padding: '4px 8px',
                marginTop: -16,
                marginBottom: -32,
            }}
            content={
                <ContainerDropdown
                    onChange={handleOnChange}
                    selectedContainer={
                        (value || '').includes('px') ? null : parseFloat(value)
                    }
                />
            }
        >
            <Range {...props} onFocus={() => setOpen(true)} />
        </Popover>
    );
};
