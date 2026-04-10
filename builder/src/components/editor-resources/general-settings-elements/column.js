import { makeBgSettings } from '../compound-settings';
import { makeLinkModules } from '../shared/link-modules';

export const column = [
    {
        hoverControl: false,
        label: 'Content Alignment',
        modules: [
            {
                path: 'style/justifyContent',
                content: {
                    template: 'Tab',
                    inputType: 'boxed',
                    defaultValue: 'normal',
                    label: 'Vertical Alignment',
                    labelExtraDirection: 'vertical',
                    options: [
                        { value: 'normal', label: 'Normal' },
                        { value: 'flex-start', label: 'Top' },
                        { value: 'center', label: 'Center' },
                        { value: 'flex-end', label: 'Bottom' },
                    ],
                },
            },
            {
                path: 'style/textAlign',
                content: {
                    isResponsible: true,
                    label: 'Horizontal Alignment',
                    labelExtraDirection: 'vertical',
                },
            },
        ],
    },
    {
        label: 'Background',
        modules: makeBgSettings('style', ['color']),
    },
    {
        hoverControl: false,
        label: 'Column Settings',
        modules: [
            {
            },
        ],
    },
];
