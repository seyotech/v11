import { makeBgSettings } from '../compound-settings';

export const section = [
    {
        hoverControl: false,
        label: 'Section Background',
        modules: makeBgSettings('style', [
            'color'
        ]),
    },
    {
        hoverControl: false,
        label: 'Width & Height',
        modules: [
            {
                path: 'style/width',
                content: {
                    info: 'Set the width of the section',
                    allowedUnits: ['%', 'px', 'em', 'rem', 'vw'],
                },
            },
            {
                path: 'style/maxWidth',
                content: {
                    allowedUnits: ['%', 'px', 'em', 'rem', 'vw'],
                },
            },
            // TODO: section alignment
            // 'wrapper/margin',
            {
                path: 'style/minHeight',
                content: {
                    allowedUnits: ['px', 'em', 'rem', 'vh'],
                },
            },
            {
                path: 'style/height',
                content: {
                    allowedUnits: ['px', 'em', 'rem', 'vh'],
                },
            },
            {
                path: 'style/maxHeight',
                content: {
                    allowedUnits: ['px', 'em', 'rem', 'vh'],
                },
            },
        ],
    },
];
