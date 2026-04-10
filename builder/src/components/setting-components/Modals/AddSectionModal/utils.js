export const searchFilter = ({ item, type, searchVal }) => {
    return item[type]?.toLowerCase().includes(searchVal.toLowerCase());
};
