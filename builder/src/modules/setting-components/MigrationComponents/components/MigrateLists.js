import React from 'react';

function MigrateLists({ currentEditItem, handleChange }) {
    React.useEffect(() => {
        const {
            lists: { align },
            style = {},
        } = currentEditItem;

        if (align) {
            const { justifyContent, alignItems, flexDirection } = style;

            if (justifyContent || alignItems) {
                return;
            } else {
                const prop =
                    flexDirection === 'column'
                        ? 'alignItems'
                        : 'justifyContent';
                const val = {
                    right: 'flex-end',
                    center: 'center',
                    left: 'flex-start',
                }[align];

                const value = { ...style };
                value[prop] = val;

                handleChange({
                    value,
                    name: `style`,
                });
            }
        }
    }, [currentEditItem, handleChange]);

    return null;
}

export default MigrateLists;
