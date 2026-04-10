import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input, Space } from 'antd';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Renders an input field with optional prefix and suffix icons. Handles validation for specific types of inputs.
 * @param {Object} props - The props passed to the InputText component.
 * @param {string} props.name - The name of the input field.
 * @param {string} props.type - The type of the input field (e.g., "text", "password", "url").
 * @param {string} props.value - The current value of the input field.
 * @param {string} props.label - The label for the input field.
 * @param {string} props.prefix - The prefix icon for the input field (optional).
 * @param {string} props.suffix - The suffix icon for the input field (optional).
 * @param {RegExp} props.validate - The regular expression used to validate the input value (optional).
 * @param {string} props.placeholder - The placeholder text for the input field (optional).
 * @param {string} props.defaultValue - The default value for the input field (optional).
 * @param {function} props.handleOnChange - The callback function to handle input changes.
 * @returns {JSX.Element} - The rendered InputText component.
 */
const InputText = (props) => {
    const {
        name,
        type,
        value,
        label,
        prefix,
        suffix,
        validate,
        placeholder,
        defaultValue,
        handleOnChange,
        validateBeforeSaving = false,
    } = props;
    const [validationError, setValidationError] = useState('');
    const [data, setData] = useState(value ?? '');
    const { t } = useTranslation('builder');

    const debouncedSave = useCallback(
        debounce((value) => {
            handleOnChange({ name, value });
        }, 100),
        [handleOnChange, name]
    );

    const handleChange = ({ target: { value } }) => {
        if (type === 'id') value = value.replace(/\s/g, '-');
        if (type === 'url' && validate && typeof validate !== 'function') {
            value = value.trim();
            const matched = value.match(validate);
            if (!matched) {
                setValidationError(t('The URL is invalid'));
            } else {
                setValidationError('');
                setData(value);
                debouncedSave(value);
                return;
            }
        }
        if (validate && typeof validate === 'function') {
            const { valid, error } = validate(value, t);
            if (!valid) {
                setValidationError(error);
                setData(value);
                if (validateBeforeSaving) return;
            } else {
                setValidationError('');
            }
        }
        setData(value);
        debouncedSave(value);
    };

    const prefixSuffix = (str) => {
        if (!str) return;
        if (typeof str === 'string' && str.split(' ')[0].includes('fa')) {
            return <FontAwesomeIcon className="icon" icon={str.split(' ')} />;
        }
        return str;
    };

    return (
        <Space direction="vertical">
            <Input
                name={name}
                size="small"
                value={data}
                data-testid={label}
                onChange={handleChange}
                style={{ width: '100%' }}
                readOnly={props.readonly}
                disabled={props.disabled}
                placeholder={t(placeholder)}
                defaultValue={defaultValue}
                prefix={prefixSuffix(prefix)}
                suffix={prefixSuffix(suffix)}
            />
            {validationError && (
                <div style={{ color: 'red' }}>{validationError}</div>
            )}
        </Space>
    );
};

export default InputText;
