import React, { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Input from './Input';
import InputGroup from './InputGroup';
import ButtonAlt from '../other-components/Button';

function DataAttributes({
    name,
    value = [],
    btnLabel,
    infoText,
    regex,
    unique,
    hasError,
    onChange,
    modContent,
}) {
    const addNewColor = useCallback(() => {
        const modified = value ? [...value] : [];
        modified.push('');
        onChange({ name, value: modified });
    }, [name, value, onChange]);

    if (modContent) {
        btnLabel = modContent.btnLabel;
        infoText = modContent.infoText;
        unique = modContent.unique;
        regex = modContent.regex;
    }

    const handleChange = useCallback(
        ({ name: index, value: newValue }) => {
            const modified = [...value];
            newValue !== undefined
                ? modified.splice(index, 1, newValue)
                : modified.splice(index, 1);
            onChange({ name, value: modified });
        },
        [name, onChange, value]
    );

    return (
        <>
            {value.map((item, index) => (
                <div key={index} style={{ marginBottom: 10 }}>
                    <InputGroup key={index} hasError={hasError}>
                        <Input
                            value={item}
                            // there was a warning..
                            // name={index}
                            // onBlur={onBlur}
                            hasError={regex && !item.match(regex)}
                            name={index.toString()}
                            onChange={handleChange}
                            placeholder={`${
                                infoText || 'data-example="value"'
                            }`}
                        />

                        <button
                            style={{
                                border: 0,
                                color: 'white',
                                background: '#ff4d4f',
                                width: '40px',
                                borderRadius: '0 5px 5px 0',
                            }}
                            onClick={() => handleChange({ name: index })}
                        >
                            <FontAwesomeIcon icon={['far', 'trash-alt']} />
                        </button>
                    </InputGroup>
                    {regex && !item.match(regex) && (
                        <span style={{ color: 'red', marginLeft: 10 }}>
                            *data-attribute is not valid
                        </span>
                    )}
                </div>
            ))}
            <ButtonAlt
                size="sm"
                width="100%"
                disabled={unique && value.length > 0}
                border="dotted"
                onClick={addNewColor}
            >
                {btnLabel || 'Add New Data Attribute'}
            </ButtonAlt>
        </>
    );
}

export default DataAttributes;
