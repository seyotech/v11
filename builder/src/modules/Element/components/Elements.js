import React, { useContext, useState } from 'react';
import DrawerHeader from 'modules/Shared/DrawerHeader';
import elements from '../data/elements';
import structureElements from '../data/element/structureElements';
import ElementGroup from './ElementGroup';
import { filterElement } from '../utils/element';
import debounce from 'lodash.debounce';
import { ElementContext } from 'contexts/ElementRenderContext';
import { BuilderContext } from 'contexts/BuilderContext';
import { useTranslation } from 'react-i18next';

const Elements = () => {
    const { page } = useContext(ElementContext);
    const { appName } = useContext(BuilderContext);
    const [search, setSearch] = useState('');
    const { t } = useTranslation('builder');
    const handleSearch = debounce((e) => setSearch(e.target.value), 500);
    let targetElements = elements;
    if (appName === 'CMS') {
        targetElements = elements.map((group) => {
            let { type, items } = group;
            if (type === 'cms') {
                items = [...items, { ...structureElements[2], lagacy: false }];
                return { ...group, items };
            }
            return group;
        });
    }

    return (
        <>
            <DrawerHeader title={t('Add Elements')} onChange={handleSearch} />
            <div>
                <ElementGroup
                    items={filterElement({
                        data: targetElements,
                        search,
                        appName,
                        page,
                    })}
                />
            </div>
        </>
    );
};

export default Elements;
