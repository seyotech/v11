import React from 'react';

function MigrateDynamicTextItems({ currentEditItem, handleChange }) {
    // Convert dynamic text content property
    // `label` to `content`
    // to provide backward compatibility
    React.useEffect(() => {
        const { dynamicText } = currentEditItem;
        const found = dynamicText?.items?.find((item) => item.label);
        if (found) {
            const items = dynamicText.items.map((item) => ({
                ...item,
                content: item.content || item.label,
            }));

            handleChange({
                value: items,
                name: 'dynamicText/items',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // DANGER ZONE -> MUST BE ON MOUNT

    return null;
}

export default MigrateDynamicTextItems;
