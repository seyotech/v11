import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Space } from 'antd';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import useGlobals from 'hooks/useGlobals';
import { Picker } from 'modules/Shared/settings-components/Picker';
import RenderComponentWithLabel from 'modules/Shared/settings-components/RenderComponentWithLabel';
import isObject from '../../../../util/isObject';
import { GlobalColors } from './GlobalColors';

let uuid = nanoid(6);
const ColorComponentStc = styled(Space)`
    &&&& {
        margin-left: auto;
        & .ant-space-item:first-child {
            ${({ $isLabelpositionInline }) =>
                !$isLabelpositionInline && { flex: 1 }}
        }
    }
`;

/**
 * ColorComponent
 *
 * @param {Object} props
 * @param {string} props.name - The name of the component.
 * @param {string} props.value - The current value of the component.
 * @param {string} props.label - The label of the component.
 * @param {Function} props.onChange - Function to call when the value changes.
 * @param {string} [props.placeholder] - A placeholder text (optional).
 * @param {string} [props.defaultValue] - The default value of the component (optional).
 */

const ColorComponent = (props) => {
    const { colors, setColors } = useGlobals();
    const { name, value, onChange, placeholder, defaultValue } = props;
    const [selectedColor, setSelectedColor] = useState(value?.value || value);
    const [isGlobalColorActive, setIsGlobalColorActive] = useState(false);

    const isLabelpositionInline =
        props.module?.labelPosition == 'inline' ||
        props.labelPosition == 'inline' ||
        !!props.module?.label ||
        !!props.label;

    useEffect(() => {
        if (isObject(value)) {
            const found = colors.find((col) => col.key === value.key);
            if (found) {
                setSelectedColor(found.value);
                setIsGlobalColorActive(true);
            } else {
                //if global color is deleted from global styles
                onChange({ name, value: '' });
            }
        } else {
            setSelectedColor(value);
            setIsGlobalColorActive(false);
        }
    }, [value]);

    return (
        <RenderComponentWithLabel
            {...props}
            module={{
                ...(props.module || props),
                ...(isLabelpositionInline && { labelPosition: 'inline' }),
            }}
        >
            <ColorComponentStc $isLabelpositionInline={isLabelpositionInline}>
                <Picker
                    name={name}
                    value={selectedColor}
                    onChange={onChange}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    isLabelpositionInline={isLabelpositionInline}
                />
                <GlobalColors
                    key={uuid}
                    name={name}
                    value={value}
                    isGlobalColorActive={isGlobalColorActive}
                    onChange={onChange}
                    colors={colors}
                    setColors={setColors}
                />
                <FontAwesomeIcon
                    style={{ color: '#747192', cursor: 'pointer' }}
                    onClick={() => {
                        onChange({ name, value: '' });
                        uuid = nanoid(6);
                    }}
                    icon={icon({ type: 'regular', name: 'eraser' })}
                />
            </ColorComponentStc>
        </RenderComponentWithLabel>
    );
};

export default ColorComponent;
