import { useEffect, useState } from 'react';
import { icons } from 'feather-icons';
import FuzzySearch from 'fuzzy-search';

const fsSetup = new FuzzySearch(Object.values(icons), ['name', 'tags'], {
    caseSensitive: false,
});

function useSearch(query) {
    const [results, setResults] = useState(Object.values(icons));

    useEffect(() => {
        const searchedIcons = fsSetup.search(query.trim());
        const iconList = searchedIcons.map((icon) => ({
            ...icon,
            value: {
                iconName: icon.name,
                prefix: 'feather',
                type: 'feather',
            },
        }));
        setResults(iconList);
    }, [query]);

    return results;
}

export default useSearch;
