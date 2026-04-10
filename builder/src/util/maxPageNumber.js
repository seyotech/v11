export const maxPageNumber = ({
    pages = [],
    oldPages = [],
    value = 'Home Old',
}) =>
    [...pages, ...oldPages]
        .filter((page) => page.name?.startsWith(value))
        .reduce((prev, curr) => {
            let currentPageNumber = Number(curr.name.replace(value, ''));
            return prev > currentPageNumber ? prev : currentPageNumber + 1;
        }, 0) || '';
