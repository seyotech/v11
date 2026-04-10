export const combineFields = ({ originalFields, transFields }) => {
    const fields = originalFields.map((field, i) => {
        const { rules: originalRules, ...restItem } = field || {};
        const { rules: transRules, ...transItem } = transFields[i] || {};
        const rules = originalRules?.map((role, i) => ({
            ...role,
            ...transRules[i],
        }));
        return { ...restItem, ...transItem, rules };
    });
    return fields;
};
