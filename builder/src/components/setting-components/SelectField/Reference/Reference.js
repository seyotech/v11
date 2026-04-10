import React, { useMemo } from 'react';
import { Select, Form } from 'antd';
import { useContext, useState } from 'react';

import { BuilderContext } from '../../../../contexts/BuilderContext';
import { fieldTypesEnum } from '../../../../constants/cmsData';

export const Reference = ({ topicId, value, onChange, name: refName }) => {
    const [itemId] = useState(value);
    const form = Form.useFormInstance();
    const isMultiRef =
        form.getFieldValue('type') === fieldTypesEnum.MULTI_REFERENCE;

    const {
        siteId,
        templateItems = {},
        useCollectionItemsInfinityScroll,
    } = useContext(BuilderContext);
    const { fetchMoreItem, isFetching, options } =
        useCollectionItemsInfinityScroll({
            type: 'ITEM',
            listQueryParameters: { siteId, id: topicId, status: 'PUBLISHED' },
            singleQueryParameters: {
                collectionId: topicId,
                itemId: itemId && itemId !== '__current' ? itemId : null,
                topicItemIds: isMultiRef && value,
            },
        });

    const currentTopicId = templateItems.singleItem?.topic;

    const onScroll = async (event) => {
        var target = event.target;
        if (
            !isFetching &&
            target.scrollTop + target.offsetHeight === target.scrollHeight
        ) {
            target.scrollTo(0, target.scrollHeight);
            fetchMoreItem();
        }
    };

    const handleOnChange = (value) => {
        onChange(value);
        const selectedOptions = options?.filter((opt) =>
            [].concat(value).includes(opt.value)
        );
        let filterLabel = selectedOptions[0]?.label;
        if (selectedOptions.length > 1) {
            filterLabel = `${filterLabel} and ${
                selectedOptions.length - 1
            } more`;
        }
        const label = value === '__current' ? `current` : filterLabel;
        form.setFieldValue('label', label);
    };

    const refOptions = useMemo(() => {
        if (!currentTopicId || currentTopicId !== topicId) return options;
        return [
            {
                label: `Current ${refName}`,
                value: '__current',
            },
            ...options,
        ];
    }, [currentTopicId, options, refName, topicId]);

    let selectedValue = value;

    if (isMultiRef && !value) selectedValue = [];

    return (
        <Select
            value={selectedValue}
            defaultValue={selectedValue}
            options={refOptions}
            onPopupScroll={onScroll}
            onChange={handleOnChange}
            mode={isMultiRef ? 'multiple' : null}
            placeholder="Select Reference Field"
        />
    );
};
