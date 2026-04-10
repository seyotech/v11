import { eventNameEnums } from '../../CustomEvents';

export const shortcutKeys = new Map([
    [
        'ctrl+s',
        {
            eventName: eventNameEnums.SAVE,
            key: 'ctrl+s',
            when: 'state.focus',
        },
    ],
    [
        'cmd+s',
        {
            eventName: eventNameEnums.SAVE,
            key: 'ctrl+s',
            when: 'state.focus',
        },
    ],
    [
        'cmd+z',
        {
            eventName: eventNameEnums.UNDO,
            key: 'cmd+z',
            when: 'state.focus',
        },
    ],
    [
        'ctrl+z',
        {
            eventName: eventNameEnums.UNDO,
            key: 'ctrl+z',
            when: 'state.focus',
        },
    ],
    [
        'cmd+shift+z',
        {
            eventName: eventNameEnums.REDO,
            key: 'cmd+shift+z',
            when: 'state.focus',
        },
    ],
    [
        'ctrl+shift+z',
        {
            eventName: eventNameEnums.REDO,
            key: 'ctrl+shift+z',
            when: 'state.focus',
        },
    ],
    [
        'cmd+shift+p',
        {
            eventName: eventNameEnums.PUBLISH,
            key: 'cmd+shift+z',
            when: 'state.focus',
        },
    ],
    [
        'ctrl+shift+p',
        {
            eventName: eventNameEnums.PUBLISH,
            key: 'ctrl+shift+z',
            when: 'state.focus',
        },
    ],
    [
        'cmd+shift+/',
        {
            eventName: eventNameEnums.SHOW,
            key: 'cmd+shift+/',
            when: 'state.focus',
        },
    ],
    [
        'ctrl+shift+/',
        {
            eventName: eventNameEnums.SHOW,
            key: 'ctrl+shift+/',
            when: 'state.focus',
        },
    ],
]);
