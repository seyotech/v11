/*****************************************************
 * Packages
 ******************************************************/
import { Select, Space } from 'antd';
import { useContext, useEffect, useState } from 'react';

/*****************************************************
 * Locals
 ******************************************************/
import { BuilderContext } from 'contexts/BuilderContext';
import { useTranslation } from 'react-i18next';
import { PreservedElementCollections } from './PreservedElementCollections';

export function SectionLibraryCollection() {
    const [currentTag, setCurrentTag] = useState('');
    const { t } = useTranslation('builder');

    const { getElements, removeElement, isFetching, getVisibleElements } =
        useContext(BuilderContext);
    const [shouldFetch, setShouldFetch] = useState(true);

    const sectionLibraries = getVisibleElements('providedSections') || [];

    const filteredSectionLibraries = sectionLibraries.filter(
        (item) => !currentTag || item.tags?.includes(currentTag)
    );

    const handleDeleteElement = async (id, type) => {
        const deleted = await removeElement(id, type);
        deleted && setShouldFetch(true);
    };

    const options = [
        ...new Set(sectionLibraries.flatMap((val) => val.tags)),
    ].map((val) => ({ value: val, label: val }));

    const handleFilter = (value) => {
        setCurrentTag(value);
    };

    useEffect(() => {
        if (shouldFetch) {
            getElements('SECTION', 'providedSections');
            setShouldFetch(false);
        }
    }, [shouldFetch]);

    return (
        <Space direction="vertical">
            <Select
                size="small"
                value={currentTag}
                defaultValue=""
                style={{ width: '100%' }}
                options={[{ value: '', label: t('All Blocks') }].concat(
                    options
                )}
                onChange={handleFilter}
            />
            <PreservedElementCollections
                isFetching={isFetching}
                elements={filteredSectionLibraries}
                handleDeleteElement={handleDeleteElement}
            />
        </Space>
    );
}
