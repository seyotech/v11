import React, { useContext, useRef } from 'react';
import { Input } from 'antd';
import RenderComponentWithLabel from '../../../Shared/settings-components/RenderComponentWithLabel';
import { BuilderContext } from '../../../../contexts/BuilderContext';
const { TextArea } = Input;

function SchemaEditor(props) {
    const { module, value, label, name, placeholder, defaultValue, onChange } =
        props;
    const { useLimit } = useContext(BuilderContext);
    const { hasFeaturePermission } = useLimit();
    const isFeatureLocked = !hasFeaturePermission();

    const ref = useRef();
    const handleChange = ({ target: { value } }) => {
        onChange({ name, value });
    };

    const handleMenuClick = ({ value, code, name }) => {
        const element = ref.current.resizableTextArea.textArea;
        let newValue =
            value.slice(0, element.selectionEnd) +
            code +
            value.slice(element.selectionEnd);
        onChange({ name, value: newValue });
    };

    return (
        <RenderComponentWithLabel
            {...props}
            customMenuClick={handleMenuClick}
            module={module}
            disabled={isFeatureLocked}
        >
            <TextArea
                ref={ref}
                rows={8}
                value={value}
                data-testid={label}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={props.disabled || isFeatureLocked}
                defaultValue={defaultValue || value}
            />
        </RenderComponentWithLabel>
    );
}

export default SchemaEditor;
