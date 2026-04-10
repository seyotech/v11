import { useHotkeys } from 'react-hotkeys-hook';

import { eventManager } from '../../CustomEvents';
import { getKeyBinding } from '../utils/keyBinding';

export const KeyBinding = () => {
    useHotkeys('*', (event) => {
        const keyBinding = getKeyBinding(event);
        if (keyBinding) {
            event.preventDefault();
            event.stopPropagation();
            eventManager.dispatchEvent(keyBinding.eventName);
        }
    });

    return null;
};
