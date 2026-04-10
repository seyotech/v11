import { Select, Spin } from 'antd';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import { BuilderContext } from '../../contexts/BuilderContext';

function CollectionDropdown({ page, onSaveSettings = () => {} }) {
    const [selectedItem, setSelectedItem] = useState('');
    const { templateItems = {} } = useContext(BuilderContext);
    const { t } = useTranslation('builder');
    const { singleItem, fetchMoreItem, options, isLoading, getSingleItem } =
        templateItems;

    const handleCollectionItem = (itemId) => {
        setSelectedItem(itemId);
        onSaveSettings(itemId);
        getSingleItem({ itemId });
    };

    const handleScroll = (e) => {
        e.persist();
        const { target } = e;

        if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
            fetchMoreItem();
        }
    };

    const queryType = {
        POST: 'id',
        TOPIC: '_id',
        CATEGORY: 'id',
    }[page.ref];

    const defaultValue = {
        TOPIC: singleItem[queryType],
        POST: singleItem[queryType],
        CATEGORY: singleItem[queryType],
    }[page.ref];

    useEffect(() => {
        setSelectedItem(defaultValue);
        onSaveSettings(singleItem[queryType]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue, queryType, page.slug]);

    return (
        <CustomSelect
            options={options}
            onChange={handleCollectionItem}
            onPopupScroll={handleScroll}
            value={selectedItem}
            placeholder={t('Select collection item')}
            notFoundContent={isLoading ? <Spin size="small" /> : null}
        />
    );
}

const CustomSelect = styled(Select)`
    width: 200px;
    text-align: left;
    .ant-select-selector {
        border: none !important;
        padding: 0 !important;
    }
    .ant-select-selector,
    .ant-select-selector:focus,
    .ant-select-selector:active,
    .ant-select-open .ant-select-selector {
        border: none !important;
        outline: 0 !important;
        box-shadow: none !important;
    }
    .ant-select-arrow {
        transform: translateX(8px);
    }
`;

export default CollectionDropdown;
