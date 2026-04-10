import { t } from 'i18next';

const addKeyToThePageNode = (pages, parentKey = '0') => {
    return pages.map((page, index) => {
        const key = `${parentKey}-${index}`;

        if (page.children) {
            page.children = addKeyToThePageNode(page.children, key);
        }

        return { key, ...page };
    });
};

export const sortPagesByPageIndex = (pages) =>
    pages
        .map((page) => {
            if (page.children) {
                page.children = sortPagesByPageIndex(page.children);
            }
            return page;
        })
        .sort((a, b) => (a.pageIndex > b.pageIndex ? 1 : -1));

const findOrCreatePageNode = ({
    currentNode,
    slug,
    title,
    pageIndex,
    pageType,
}) => {
    let node = currentNode.children.find((n) => n.slug === slug);
    if (!node || !slug) {
        node = { slug, title, pageIndex, children: [], pageType };
        currentNode.children.push(node);
    }

    return node;
};

export function buildPageTreeNodes(pages) {
    const treeData = [];

    for (const { slug, name, id, pageIndex, pageType } of pages) {
        let slugs = slug ? slug.split('/') : [''];

        if (pageType === 'HOMEPAGE') {
            slugs = [slug];
        }

        let currentNode = { children: treeData };

        for (let i = 0; i < slugs.length; i++) {
            const currentSlug = slugs.slice(0, i + 1).join('/');
            const isLastKey = i === slugs.length - 1;
            const title = isLastKey ? name : t('Unknown');

            currentNode = findOrCreatePageNode({
                title,
                pageIndex,
                currentNode,
                slug: currentSlug,
                pageType,
            });

            if (isLastKey) {
                Object.assign(currentNode, {
                    id,
                    title,
                    pageIndex,
                    pageType,
                });
            }
        }
    }

    return addKeyToThePageNode(treeData);
}

export const getNestedPages = ({ replacer, parentSlug, pages }) => {
    const updatedPages = [];

    const recursivelyAddNestedPages = (pages) => {
        pages.forEach(({ id, children = [], slug, pageType }) => {
            recursivelyAddNestedPages(children);
            const lastPartOfDragNode = slug.replace(replacer, '');
            const updatedSlug = `${parentSlug}/${lastPartOfDragNode}`;

            updatedPages.push({
                id,
                slug: updatedSlug,
                pageType,
            });
        });
    };

    recursivelyAddNestedPages(pages);

    return updatedPages;
};

export const getPageDropInfo = ({
    dropToGap,
    dropPosition,
    dragNode: { slug: dragSlug },
    node: { slug: dropSlug, id: droppedId },
}) => {
    const warningMessages = {
        homePage: t('You cannot insert a page into a home page'),
        sameLayer: t('You cannot move a page within the same layer'),
        unknownPage: t('You cannot insert a page into an unknown page'),
    };

    // Check if it is an unknown page
    if (!droppedId) {
        return { warning: warningMessages.unknownPage };
    }

    const dragSlugParts = dragSlug.split('/');
    const lastPartOfDragNode = dragSlugParts.pop();

    const dropSlugParts = dropSlug.split('/');
    const parentSlugParts =
        dropToGap && dropPosition > 0
            ? dropSlugParts.slice(0, -1)
            : dropSlugParts;

    const parentSlug = [...parentSlugParts, lastPartOfDragNode].join('/');
    const isHomePage = dropSlug === '/' || dropSlug === 'index';
    const isSameLayer = isHomePage
        ? dragSlug === lastPartOfDragNode
        : parentSlug === dragSlug;

    // Check if it is a home page
    if (!dropToGap && isHomePage) {
        return { warning: warningMessages.homePage };
    }

    // Check if the drag node is being moved within the same layer
    if (isSameLayer) {
        return { warning: warningMessages.sameLayer };
    }

    return { parentSlug };
};

export const getSelectKey = (context, treeData) => {
    const { pages, editPageIndex } = context;
    if (!pages || typeof editPageIndex !== 'number') return '';

    const currentPage = pages[editPageIndex];
    if (!currentPage) return '';

    const { slug } = currentPage;
    const slugs = slug.split('/');
    let parentNode = null;
    let selectedNode = null;
    let nodes = treeData;

    for (let i = 0; i < slugs.length; i++) {
        const slug = slugs.slice(0, i + 1).join('/');
        const isLastKey = i === slugs.length - 1;
        parentNode = nodes.find((n) => n.slug === slug);
        if (!isLastKey) {
            nodes = parentNode?.children || [];
        } else {
            selectedNode = parentNode;
        }
    }

    return selectedNode?.key;
};

export const getParentAddressList = (selectedElementKey, expandedKeys) => {
    return selectedElementKey
        .split('-')
        .reduce((acc, item, index) => {
            index == 0 ? acc.push(item) : acc.push(acc[index - 1] + '-' + item);
            return acc;
        }, [])
        .filter((item) => !expandedKeys.includes(item));
};
