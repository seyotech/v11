import getPathValue from 'util/getPathValue';

export const getOptionFromSource = ({
    key,
    value,
    source,
    currentEditItem,
}) => {
    if (!source || !currentEditItem) return {};

    const items = getPathValue(source, currentEditItem);

    const options = items.map((item, i) => ({
        label: item[key],
        value: item[value] || i,
    }));

    return { options };
};
