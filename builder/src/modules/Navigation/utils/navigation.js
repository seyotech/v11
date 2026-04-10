export function getExpandedKeys({ treeData, searchTerm }) {
    if (!treeData || !searchTerm) return [];

    const expandedKeys = new Set();
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    function recursivelyGenerateKey(nodes) {
        nodes.forEach((node) => {
            const isSearchIncludedInTitle = node.title
                .toLowerCase()
                .includes(lowerCaseSearchTerm);

            if (isSearchIncludedInTitle) {
                // key slicing is necessary as we have to expand parent if search is matched with any child node
                expandedKeys.add(node.key.slice(0, -2));
            } else if (node.children) {
                recursivelyGenerateKey(node.children);
            }
        });
    }

    recursivelyGenerateKey(treeData);
    return [...expandedKeys];
}
