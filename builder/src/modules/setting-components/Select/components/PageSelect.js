import { useCallback, useContext, useMemo } from 'react';

import { EditorContext } from 'contexts/ElementRenderContext';
import { useTranslation } from 'react-i18next';
import { useToast } from 'util/toast';
import SelectInput from './SelectInput';

/**
 * Returns a new array of pages by filtering the input array to find regular pages and a home page.
 * The home page is placed as the first element in the new array.
 * @param {Array} pages - An array of objects representing pages.
 * Each object should have properties: pageType, id, slug, type, and name.
 * @returns {Array} - An array of pages, where the home page is the first element followed by regular pages.
 * @example
 * Output: [
 *   { pageType: 'HOMEPAGE', id: 2, slug: 'home', type: 'type2', name: 'Home Page' },
 *   { pageType: 'REGULAR', id: 1, slug: 'page1', type: 'type1', name: 'Page 1' },
 *   { pageType: 'REGULAR', id: 3, slug: 'page2', type: 'type1', name: 'Page 2' }
 * ]
 */
const getPage = (pages) => {
    const regularPage = pages.filter(({ pageType }) => pageType === 'REGULAR');
    const homePage = pages.find(
        ({ pageType, type }) => pageType === 'HOMEPAGE' || type === 'INDEX'
    );
    return [homePage, ...regularPage];
};

/**
 * Renders a select input component with options generated from the `content` array in the `EditorContext` and the `symbols` object in the `ElementContext`.
 *
 * @param {object} props - The properties for configuring the select input component.
 * @param {string} props.name - The name of the select input.
 * @param {string} props.value - The selected value of the select input.
 * @param {function} props.onChange - The onChange event handler for the select input.
 * @returns {JSX.Element} The rendered SelectInput component.
 */
function PageSelect({ value, ...props }) {
    const { name, onChange } = props;
    const ctx = useContext(EditorContext);
    const { t } = useTranslation('builder');
    const regularPages = getPage(ctx.pages);
    const toast = useToast();
    const pagesOptions = useMemo(() => {
        return regularPages.map((page) => ({
            value: page.linkId || page.id,
            slug: page.slug,
            type: page.type,
            name: page.name + (!page.id ? ` (unsaved)` : ''),
        }));
    }, [regularPages]);
    const isPageExists = pagesOptions.some((page) => page.value === value);

    const handleChange = useCallback(
        ({ value }) => {
            const page = pagesOptions.find((page) => page.value === value);
            if (!page) {
                toast(
                    'warning',
                    t('Save the destination page before linking to it.')
                );
                return;
            }
            onChange({ name, value: page.value });
        },
        [name, onChange, pagesOptions]
    );

    return (
        <SelectInput
            onChange={handleChange}
            options={pagesOptions}
            value={isPageExists && value}
            placeholder={t('Select A Page')}
            {...props}
        />
    );
}

export default PageSelect;
