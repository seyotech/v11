import { useCallback } from 'react';

import { GroupContainer } from 'modules/Shared/GroupContainer';
import useGlobals from '../../hooks/useGlobals';
import { ColorComponent } from '../../modules/setting-components/ColorComponent';
import isObject from '../../util/isObject';
import Label from '../setting-components/Label/Label';
import Range from './Range';

const regx = /(--color-\d+)/gi;

function SimpleBorder(props) {
    const { value, onChange, name, borderLabel, colorLabel } = props;
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
        <GroupContainer>
            <Label style={{ marginTop: 20 }}>
                {borderLabel || 'Border Width'}
            </Label>
            <Range defaultUnit="px" value={width} onChange={handleRange} />

            <ColorComponent
                value={selectedColor}
                label={colorLabel || 'Color'}
                onChange={handleColorChange}
            />
        </GroupContainer>
    );
}

export default SimpleBorder;

function parseBorderString(value = '') {
    const values = value.match(/(\w+)\s(\w+)\s(.+)?/);
    return values ? values.slice(1) : [];
}
