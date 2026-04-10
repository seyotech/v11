import { useCallback } from 'react';

import { Space } from 'antd';
import useGlobals from 'hooks/useGlobals';
import { ColorComponent } from 'modules/setting-components/ColorComponent';
import { Range } from 'modules/setting-components/Range';
import { useTranslation } from 'react-i18next';
import isObject from 'util/isObject';

const regx = /(--color-\d+)/gi;

function SimpleBorder(props) {
    const { value, onChange, name, borderLabel, colorLabel } = props;
    const { t } = useTranslation('builder');
    let [width = '', style = 'solid', color = ''] = parseBorderString(value);

    let selectedColor = color;
    const { colors } = useGlobals();
    const isGlobalColor = regx.test(color);
    if (isGlobalColor) {
        selectedColor = colors.find((col) => col.key === color.match(regx)[0]);
    }

    const handleRange = useCallback(
        ({ value }) => {
            onChange({ name, value: `${value} ${style} ${color}` });
        },
        [onChange, name, style, color]
    );

    const handleColorChange = useCallback(
        ({ value }) => {
            value = isObject(value) ? `var(${value.key})` : value;
            onChange({ name, value: `${width} ${style} ${value}` });
        },
        [name, onChange, style, width]
    );

    return (
        <Space direction={'vertical'} style={{ width: '100%' }}>
            <Range
                {...props}
                module={{
                    ...props.module,
                    label: borderLabel || t('Border Width'),
                    defaultUnit: 'px',
                }}
                value={width}
                defaultUnit="px"
                onChange={handleRange}
            />

            <ColorComponent
                value={selectedColor}
                label={colorLabel || t('Color')}
                onChange={handleColorChange}
            />
        </Space>
    );
}

export default SimpleBorder;

function parseBorderString(value = '') {
    const values = value.match(/(\w+)\s(\w+)\s(.+)?/);
    return values ? values.slice(1) : [];
}
