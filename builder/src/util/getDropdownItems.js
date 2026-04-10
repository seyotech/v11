export const getDropdownItems = (fields) => {
    fields ??= [];

    return fields.map((field, idx) => {
        const item = {
            ...field,
            label: field.name,
            value: field.code,
            key: '' + idx,
        };

        if (field.codes) {
            item.key = `${idx}+${field.refTopic}`;

            item.children = field.codes.reduce(
                (filteredChildren, code, key) => {
                    if (code.type !== 'SINGLE_REFERENCE') {
                        var newChildItem = {
                            ...code,
                            label: code.name,
                            code: code.code,
                            value: code.code,
                            key: '' + idx + '+' + key,
                        };
                        filteredChildren.push(newChildItem);
                    }
                    return filteredChildren;
                },
                []
            );
            item.popupClassName = 'add-cms-field-dropdown-sub-menu';
        } else {
            item.code = field.code;
        }

        return item;
    });
};
