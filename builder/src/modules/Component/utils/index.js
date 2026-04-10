export const getFormattedLibraryData = (components) => {
    const allTags = Array.from(
        new Set(components.flatMap(({ tags = [] }) => tags))
    );

    return allTags
        .map((tag) => {
            const componentsWithTag = components.filter(({ tags = [] }) =>
                tags.includes(tag)
            );

            if (componentsWithTag.length) {
                return {
                    title: tag,
                    components: componentsWithTag,
                };
            }
        })
        .filter(Boolean);
};

export const getFormattedSavedElementsData = (components) => {
    const types = ['SECTION', 'ROW', 'COLUMN', 'ELEMENT'];
    return types
        .map((type) => {
            return {
                title: type,
                components: components.filter(
                    (component) => type === component.type
                ),
            };
        })
        .filter(({ components }) => components.length);
};
