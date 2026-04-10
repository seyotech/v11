import { Form, Select } from 'antd';
import debounce from 'lodash/debounce';
import { useContext, useMemo } from 'react';
import { isDev } from '../../../../config';
import { dateSortOrders, textSortOrders } from '../../../../constants/cmsData';
import { EditorContext } from 'contexts/ElementRenderContext';
import { fieldTypesEnum } from 'util/fieldTypes';
import { useTranslation } from 'react-i18next';
import useCMS from '../../../../hooks/useCMS';

function SortSelector({ value: field = {}, onChange }) {
    const { t } = useTranslation();
    const { useGetCmsFields } = useCMS();
    const [form] = Form.useForm();

    const { currentEditItem } = useContext(EditorContext);
    const {
        source,
        topicSlug,
        selectedCollection: { slug } = {},
    } = currentEditItem.configuration;

    const sortBy = Form.useWatch('sortBy', form);
    const type = Form.useWatch('type', form);

    let { fields: sortablefieldsOpts } = useGetCmsFields({
        slug: topicSlug || slug,
        source,
    });

    const sortOrders =
        type === fieldTypesEnum.DATE ? dateSortOrders : textSortOrders;
    const sortOrderOpts = sortOrders.map(({ label, value }) => ({
        label: t(label),
        value,
    }));

    const autoSave = debounce(async () => {
        try {
            await form.validateFields();
            const { sortBy, order, type } = form.getFieldsValue();

            const fieldOption = sortablefieldsOpts?.find(
                (option) => option.value === sortBy
            );

            const orderOption = sortOrderOpts.find(
                (option) => option.value === order
            );

            onChange([
                {
                    name: 'label',
                    value: `${fieldOption.label}: ${orderOption.label}`,
                },
                {
                    name: 'field/type',
                    value: `${type}`,
                },
                { name: 'field/sortBy', value: sortBy },
                { name: 'field/order', value: order },
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
        if (key === 'sortBy') {
            const { type } = sortablefieldsOpts.find(
                (option) => option.value === value
            );

            form.setFieldsValue({ order: '', type });
        }
        autoSave();
    };

    return (
        <Form form={form} initialValues={field} onValuesChange={onValuesChange}>
            <Form.Item
                required
                name="sortBy"
                style={{ marginTop: 8 }}
                rules={[
                    {
                        required: true,
                        message: t('This field is a required field'),
                    },
                ]}
            >
                <Select
                    size="middle"
                    options={sortablefieldsOpts}
                    defaultValue={field.sortBy}
                    placeholder={t('Select A Field to Sort By')}
                />
            </Form.Item>
            <Form.Item name="label" hidden noStyle />
            <Form.Item name="type" hidden noStyle />
            {sortBy ? (
                <Form.Item
                    required
                    name="order"
                    style={{ marginTop: 8 }}
                    rules={[
                        {
                            required: true,
                            message: t('This field is a required field'),
                        },
                    ]}
                >
                    <Select
                        size="middle"
                        options={sortOrderOpts}
                        defaultValue={field.order}
                        placeholder={t('Select order')}
                    />
                </Form.Item>
            ) : null}
        </Form>
    );
}

export default SortSelector;
