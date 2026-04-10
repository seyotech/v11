/*****************************************************
 * Packages
 ******************************************************/
import FuzzySearch from 'fuzzy-search';
import uniqBy from 'lodash/uniqBy';
import { useEffect, useMemo, useState } from 'react';

/*****************************************************
 * Locals
 ******************************************************/
import { ICON_TYPES } from '../constants';

export const useIconSearch = ({ query, icons, prefix, type }) => {
    const [results, setResults] = useState(Object.values(icons));

    const fsSetup = useMemo(() => {
        const fsSetup = new FuzzySearch(
            Object.values(icons),
            ['name', 'tags', 'iconName'],
            {
                caseSensitive: false,
            }
        );
        return fsSetup;
    }, [icons]);

    useEffect(() => {
        const searchedIcons = fsSetup.search(query.trim());
        const uniqParam =
            type === ICON_TYPES.FONT_AWESOME ? '_prefixUnique' : 'name';

        const iconList = uniqBy(
            searchedIcons.map((icon) => ({
                ...icon,
                _prefixUnique: `${icon.prefix || prefix}_${
                    icon.iconName || icon.name
                }`,
                value: {
                    type,
                    prefix: icon.prefix || prefix,
                    iconName: icon.iconName || icon.name,
                },
            })),
            uniqParam
        );
        setResults(iconList);
    }, [fsSetup, prefix, query, type]);

    return results;
};
