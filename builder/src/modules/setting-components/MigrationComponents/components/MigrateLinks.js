import React from 'react';

function MigrateLinks({ currentEditItem, handleChange }) {
    React.useEffect(() => {
        const {
            links: { align },
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
    }, []);

    return null;
}

export default MigrateLinks;
