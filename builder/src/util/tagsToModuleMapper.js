import style from '../components/editor-resources/style-edit-resources';

export const tagsToModuleMapper = (items, mappedObj = {}) =>
    items.reduce((a, c) => {
        if (Array.isArray(c)) {
            c.reduce((acc, cur, i) => {
                if (Array.isArray(cur)) return tagsToModuleMapper(cur, acc);
                if (c.length - 1 === i) return (acc[cur] = { style });
                return (acc[cur] = acc[cur] || { style });
            }, a);
        } else {
            a[c] = { style };
        }
        return a;
    }, mappedObj);
