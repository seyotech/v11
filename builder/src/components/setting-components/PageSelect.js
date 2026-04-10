import React, { useContext } from 'react';

import Select from './Select';
import { EditorContext } from '../../contexts/ElementRenderContext';

const getPage = (pages) => {
    const regularPage = pages.filter(({ pageType }) => pageType === 'REGULAR');
    const homePage = pages.find(
        ({ pageType, type }) => pageType === 'HOMEPAGE' || type === 'INDEX'
    );
    return [homePage, ...regularPage];
};

function PageSelect({ name, value, onChange }) {
    const ctx = useContext(EditorContext);
    const regularPages = getPage(ctx.pages);
    const pagesOptions = React.useMemo(() => {
        const pages = regularPages.map((page) => ({
            value: page.id,
            slug: page.slug,
            type: page.type,
            name: page.name + (!page.id ? ` (unsaved)` : ''),
        }));
        return [{ name: 'Select Page', value: '' }].concat(pages);
    }, [ctx.pages]);

    const handleChange = React.useCallback(
        ({ value }) => {
            const page = pagesOptions.find((page) => page.value === value);
            if (!page) {
                window.alert('Please save the page you are trying to link to');
                return;
            }
            onChange({ name, value: page.value });
        },
        [name, onChange, pagesOptions]
    );

    return (
        <Select onChange={handleChange} value={value} options={pagesOptions} />
    );
}

export default PageSelect;
