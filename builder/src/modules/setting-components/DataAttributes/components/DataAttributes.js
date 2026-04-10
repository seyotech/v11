import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Button, Input, Space } from 'antd';
import RenderComponentWithLabel from 'modules/Shared/settings-components/RenderComponentWithLabel';
import { useTranslation } from 'react-i18next';

export function DataAttributes(props) {
    let {
        name,
        value = [],
        btnLabel,
        infoText,
        regex,
        unique,
        hasError,
        onChange,
        modContent,
        module,
    } = props;
    const { t } = useTranslation('builder');

    const addNewInput = () => {
        const modified = value ? [...value] : [];
        modified.push('');
        onChange({ name, value: modified });
    };

    if (modContent) {
        btnLabel = modContent.btnLabel;
        infoText = modContent.infoText;
        regex = modContent.regex;
    }

    const handleChange = ({ name: index, value: newValue }) => {
        const modified = [...value];
        newValue !== undefined
            ? modified.splice(index, 1, newValue)
            : modified.splice(index, 1);
        onChange({ name, value: modified });
    };

    return (
        <RenderComponentWithLabel {...props} module={module}>
            <>
                {value.map((item, index) => (
                    <Space
                        key={index}
                        style={{
                            marginBottom: 10,
                            width: '100%',
                            display: 'block',
                        }}
                        direction="horizontal"
                    >
                        <Input
                            key={index}
                            size="small"
                            data-testid={`data-attributes-input-${index}`}
                            value={item}
                            placeholder={`${
                                infoText || 'data-example="value"'
                            }`}
                            onChange={({ target: { value } }) =>
                                handleChange({ name: index, value })
                            }
                            suffix={
                                <FontAwesomeIcon
                                    data-testid={`input-delete-btn-${index}`}
                                    onClick={() =>
                                        handleChange({ name: index })
                                    }
                                    style={{
                                        cursor: 'pointer',
                                        color: '#A2A1B7',
                                    }}
                                    icon={icon({
                                        name: 'trash',
                                        style: 'regular',
                                    })}
                                />
                            }
                        />
                        {regex && !item.match(regex) && (
                            <Alert
                                banner
                                type="error"
                                data-testid={`ant-alert-message-${index}`}
                                message={t('data-attribute is not valid')}
                                style={{
                                    margin: '4px',
                                    padding: 0,
                                    background: 'transparent',
                                    color: 'red',
                                }}
                            />
                        )}
                    </Space>
                ))}
                <Button
                    size="small"
                    type="dashed"
                    onClick={addNewInput}
                    style={{ borderRadius: '6px', textAlign: 'left' }}
                    icon={
                        <FontAwesomeIcon
                            style={{ color: '#45426E' }}
                            icon={icon({ name: 'circle-plus', style: 'solid' })}
                        />
                    }
                    block
                >
                    {btnLabel || t('Add New Data Attribute')}
                </Button>
            </>
        </RenderComponentWithLabel>
    );
}
