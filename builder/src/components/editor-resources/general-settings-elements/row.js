import { appName } from '../../../config';
import { makeBgSettings } from '../compound-settings';

export const row = [
    {
        hoverControl: false,
        label: 'Row / Container Option',
        modules: [
            {
                path: 'wrapper/width',
                conditions: ['/component_label', '!==', 'nestedRow'],
                content: {
                    label: 'Row / Container Width',
                    template: 'Tab',
                    inputType: 'boxed',
                    defaultValue: '',
                    options: [
                        { label: 'Default Width', value: '' },
                        { label: '100% Width', value: '100%' },
                    ],
                },
            },
            {
                path: 'style/justifyContent',
                content: {
                    label: 'Vertical Alignment',
                    template: 'Tab',
                    labelExtraDirection: 'vertical',
                    inputType: 'boxed',
                    defaultValue: 'center',
                    isResponsible: true,
                    options: [
                        { value: 'flex-start', label: 'Left' },
                        { value: 'center', label: 'Center' },
                        { value: 'flex-end', label: 'Right' },
                    ],
                },
            },
            {
                path: 'style/alignItems',
                content: {
                    label: 'Columns Height',
                    labelExtraDirection: 'vertical',
                    template: 'Tab',
                    inputType: 'boxed',
                    defaultValue: 'stretch',
                    options: [
                        { label: 'Auto', value: 'flex-start' },
                        { label: 'Equal Height', value: 'stretch' },
                    ],
                },
            },
            {
                path: 'settings/columnGap',
                content: {
                    max: 500,
                    defaultUnit: 'px',
                    template: 'Range',
                    isResponsible: true,
                    label: 'Column Gap',
                },
            },
            {
                path: 'settings/reverseColumn',
                content: {
                    onLabel: 'ON',
                    offLabel: 'OFF',
                    onValue: true,
                    offValue: false,
                    template: 'Switch',
                    labelPosition: 'inline',
                    defaultValue: false,
                    label: 'Reverse Column (Responsive)',
                },
            },
            // {
            //     path: 'style/alignItems',
            //     conditions: ['style/alignItems', '!==', 'stretch'],
            //     content: {
            //         label: 'Vertical Alignment',
            //         template: 'Tab',
            //         inputType: 'boxed',
            //         defaultValue: '',
            //         options: [
            //             { label: 'Top', value: 'flex-start' },
            //             { label: 'Center', value: 'center' },
            //             { label: 'Bottom', value: 'flex-end' },
            //         ],
            //     },
            // },
        ],
    },
    {
        hoverControl: false,
        label: 'Row Background',
        modules: makeBgSettings('style', ['color']),
    },
    {
        label: 'PopUp Setting',
        modules: [],
    },
];
