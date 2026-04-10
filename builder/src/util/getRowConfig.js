export const getRowConfig = ({ address = [], symbols, data }) => {
    const obj = {};
    const cmsAddress = address.slice(0, 2);
    const nestedRowAddress =
        address.length >= 4 ? ['0', ...address.slice(3, 4)] : [];

    let row = cmsAddress.reduce((acc = {}, curr) => {
        let { content = [], symbolId } = acc;
        if (symbolId) {
            content = symbols[symbolId]?.data.content || [];
        }

        return content[Number(curr)];
    }, data);

    if (row?.symbolId) {
        row = symbols[row.symbolId]?.data || {};
    }

    obj.isCmsRow = row?.type === 'cmsRow';
    obj.cmsRowConfig = row?.configuration;

    if (obj.isCmsRow && nestedRowAddress.length) {
        const nestedRow = nestedRowAddress.reduce((acc = {}, curr) => {
            let { content = [], symbolId } = acc;
            if (symbolId) {
                content = symbols[symbolId]?.data.content || [];
            }

            return content[Number(curr)];
        }, row);

        obj.selectedField = nestedRow?.configuration?.selectedField;
        obj.nestedRowConfig = nestedRow?.configuration;
        obj.isNestedElement = address.length > 4;
    }

    return obj;
};
