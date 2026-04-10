import isFloat from '../../../util/isFloat';
import { filterElement as filterCmsElement } from 'util/filterElements';

// Helper function to filter elements by group
export const filterGroup = ({ element, elementTypes, cmsRow, appName }) =>
    element.type &&
    element.type !== 'structured' &&
    !!element.items.length &&
    elementTypes.includes(element.type) &&
    !(cmsRow && element.type === 'airtable') &&
    !(element.type === 'cms' && appName !== 'CMS');

// Helper function to filter regular items for CMS row
export const filterRegularItemsForCmsRow = (item, cmsComponent) => {
    return cmsComponent.includes(item.data.component_path);
};

// Helper function to filter and sort items for an element
export const filterAndSortItems = (
    element,
    appName,
    page,
    cmsRow,
    cmsComponent,
    searchVal,
    searchFilter,
    sorter
) => {
    const filteredItems = element.items
        .filter((item) => {
            if (cmsRow && element.type === 'regular') {
                return filterRegularItemsForCmsRow(item, cmsComponent);
            }

            if (element.type === 'cms') {
                return filterCmsElement({
                    element: item,
                    appName,
                    isCmsRow: cmsRow,
                    elementType: element.type,
                    pageType: page.pageType,
                });
            }

            return true;
        })
        .filter((item) => searchFilter({ item, type: 'title', searchVal }))
        .sort((currentItem, nextItem) =>
            sorter({ currentItem, type: 'title', nextItem })
        );

    return filteredItems;
};

export const filterElement = ({ data, search, appName, page }) => {
    return data
        .filter((groupItem) => {
            return !(groupItem.type === 'cms' && appName !== 'CMS');
        })
        .map((groupItem) => {
            let items = groupItem.items.filter((item) => {
                if (groupItem.type === 'cms') {
                    return filterCmsElement({
                        element: item,
                        appName,
                        elementType: 'cms',
                        pageType: page.pageType,
                    });
                }
                return true;
            });
            if (
                search &&
                groupItem.title.toLowerCase().includes(search.toLowerCase())
            ) {
                return {
                    ...groupItem,
                    items,
                };
            }
            items = items.filter((item) =>
                item.title.toLowerCase().includes(search.toLowerCase())
            );

            if (items.length > 0) {
                return {
                    ...groupItem,
                    items: items,
                };
            }
        })
        .filter(Boolean);
};

export const filterLagacyElement = (data) => {
    return data
        .map((groupItem) => {
            if (groupItem?.lagacy) {
                return false;
            }
            const items = groupItem.items.filter((el) => !el.lagacy);

            if (items.length > 0) {
                return {
                    ...groupItem,
                    items: items,
                };
            }
        })
        .filter(Boolean);
};

export function getColCount(formula) {
    const columns = formula.split('+');
    return columns.reduce((num, curr) => num + parseInt(curr), 0);
}

export const adjustFloatSize = (size) => {
    return isFloat(size) ? size.toFixed(2) : size;
};

export const generateCols = (blocks) => {
    const colCount = getColCount(blocks);

    return blocks
        .split('+')
        .map((block) => adjustFloatSize((block / colCount) * 100))
        .join('+');
};
