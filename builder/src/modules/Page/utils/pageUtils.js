export const getSelectKey = (context, treeData) => {
    const { pages, editPageIndex } = context;
    if (!pages || !editPageIndex) return '';

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
