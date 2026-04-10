import { useEffect, useState } from 'react';
import simpleIcons from 'simple-icons';
import FuzzySearch from 'fuzzy-search';

const fsSetup = new FuzzySearch(Object.values(simpleIcons), ['title', 'slug'], {
    caseSensitive: false,
});

export default function useSimpleIconSearch(query) {
    const [results, setResults] = useState(Object.values(simpleIcons));

    useEffect(() => {
        const searchedIcons = fsSetup.search(query.trim());
        const iconList = searchedIcons.map((icon) => ({
            ...icon,
            value: {
                iconName: icon.slug,
                prefix: 'simple',
                type: 'simple',
            },
        }));
        setResults(iconList);
    }, [query]);

    return results;
}
