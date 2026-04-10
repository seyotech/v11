import { Form, Select } from 'antd';
import debounce from 'lodash/debounce';
import { useContext, useMemo } from 'react';

import { isDev } from '../../../config';
import { fieldTypesEnum, operatorEnum } from '../../../constants/cmsData';
import { EditorContext } from '../../../contexts/ElementRenderContext';
import useCMS from '../../../hooks/useCMS';
import { generateFilterLabel } from '../../../util/generateFilterLabel';
import { OperatorSelector } from './OperatorSelector';
import { RenderFilterField } from './RenderFilterField';

const { BETWEEN } = operatorEnum;

function SelectField({ value: field = {}, onChange }) {
    const [form] = Form.useForm();
    const { useGetTopicBySlug } = useCMS();
    const { currentEditItem } = useContext(EditorContext);
    const { topicSlug } = currentEditItem.configuration;
    const { slug } = currentEditItem.configuration.selectedCollection || {};
    const type = Form.useWatch('type', form);
    const operator = Form.useWatch('operator', form);
    const name = Form.useWatch('name', form);
    const currentFieldName = name || field?.name;

    let { options } = useGetTopicBySlug({ slug: topicSlug || slug });
    const option = useMemo(
        () =>
            options?.find((option) => option.value === currentFieldName) || {},
        [options, currentFieldName]
    );

    const autoSave = debounce(async () => {
        try {
            await form.validateFields();
            const { name, operator, value, type, label } =
                form.getFieldsValue();

            let numberValue;
            if (operator === BETWEEN) {
                numberValue = {
                    [operatorEnum.LESS_THAN]: Number(value.$lt),
                    [operatorEnum.GREATER_THAN]: Number(value.$gt),
                };
            } else if (fieldTypesEnum.NUMBER) {
                numberValue = Number(value);
            }

            onChange([
                {
                    name: 'label',
                    value: generateFilterLabel({
                        type,
                        value,
                        label,
                        operator,
                        name: option.name,
                    }),
                },
                {
                    name: 'field/value',
                    value: type === fieldTypesEnum.NUMBER ? numberValue : value,
                },
                { name: 'field/name', value: name },
                { name: 'field/type', value: type },
                { name: 'field/operator', value: operator },
            ]);
        } catch (error) {
            // console for testing in development
            if (isDev) {
                console.log({ error });
            }
            return;
        }
    }, 1000);

    const onValuesChange = (field) => {
        const [[key, value]] = Object.entries(field);
        if (key === 'name') {
            const { type } = options.find((option) => option.value === value);
            form.setFieldsValue({ value: '', operator: '', type });
        }
        if (key === 'operator') {
            form.setFieldsValue({ value: '' });
        }
        autoSave();
    };

    return (
        <Form form={form} initialValues={field} onValuesChange={onValuesChange}>
            <Form.Item
                required
                name="name"
                style={{ marginTop: 8 }}
                rules={[
                    {
                        required: true,
                        message: 'This field is a required field',
                    },
                ]}
            >
                <Select
                    showArrow
                    size="middle"
                    options={options}
                    defaultValue={field.name}
                    placeholder="Select A Field"
                />
            </Form.Item>
            <Form.Item name="type" hidden noStyle />
            <Form.Item name="label" hidden noStyle />

            <OperatorAndFilterInput
                type={type}
                name={name}
                operator={operator}
                topicId={option.refTopic}
                items={currentEditItem.filter.items}
            />
        </Form>
    );
}

const exactMatcher = [operatorEnum.EQUAL_TO, operatorEnum.NOT_EQUAL_TO];
const likeMatcher = [operatorEnum.LIKE, operatorEnum.NOT_LIKE];

const getIgnoreOptions = ({ items = [], name }) => {
    const item = items?.find(
        (item) =>
            item.field?.name === name &&
            [...exactMatcher, ...likeMatcher].includes(item.field?.operator)
    );

    if (!item) return [];

    return exactMatcher.includes(item.field.operator)
        ? likeMatcher
        : exactMatcher;
};

const OperatorAndFilterInput = ({ type, operator, items, name, topicId }) => {
    if (!type) return null;
    const ignoreOptions = getIgnoreOptions({ items, name });

    return (
        <>
            <OperatorSelector type={type} ignoreOptions={ignoreOptions} />
            <RenderFilterField
                name={name}
                type={type}
                topicId={topicId}
                operator={operator}
            />
        </>
    );
};

export default SelectField;
