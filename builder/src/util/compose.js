const mapFn = (pages = [], type, search) => {
    const newPages = pages.map((page, pageIndex) => ({ ...page, pageIndex }));
    return [newPages, type, search];
};

const filterFn = (pages, type, search) => {
    const filteredPages = pages.filter((page) => page.pageType === type);
    const homePage = pages.find(
        (page) => page.pageType === 'HOMEPAGE' || page.type === 'INDEX'
    );

    if (type === 'REGULAR' && homePage) {
        filteredPages.unshift(homePage);
    }

    return [filteredPages, search];
};

const filteredPages = (pages, search) => {
    if (!search) return pages;
    return pages.filter((page) =>
        page.name.toLowerCase().includes(search.toLowerCase())
    );
};

const compose =
    (...fns) =>
    (pages, type, search) =>
        fns.reduce((args, fn) => fn(...args), [pages, type, search]);
export const pageCompose = compose(mapFn, filterFn, filteredPages);
