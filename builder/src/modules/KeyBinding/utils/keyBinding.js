import { shortcutKeys } from './shortcutKeys';

export const getKeyBinding = ({ key = '', shiftKey, ctrlKey, metaKey }) => {
    const keys = [];

    if (metaKey) keys.push('cmd');
    if (ctrlKey) keys.push('ctrl');
    if (shiftKey) keys.push('shift');

    keys.push(key.toLowerCase());

    return shortcutKeys.get(keys.join('+'));
};
