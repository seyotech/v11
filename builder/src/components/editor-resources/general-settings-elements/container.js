import { alignmentModules } from './align-modules';
import { makeBgSettings } from '../compound-settings/background-styles';

export const container = [
    {
        hoverControl: false,
        label: 'Container Settings',
        modules: [
            {
                path: 'style/width',
                conditions: ['/parentType', '===', 'section'],
                content: {
                    label: 'Max Width',
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
                path: 'configuration/globalWidth',
                content: {
                    template: 'WidthModeSelector',
                    label: 'Width Mode',
                    defaultValue: false,
                    options: [
                        { label: 'Custom', value: false },
                        { label: 'Global', value: true },
                    ],
                },
            },
            {
                path: 'style/flexBasis',
                conditions: [
                    ['configuration/globalWidth', '===', false],
                    '||',
                    ['/configuration', '===', undefined],
                    '&&',
                    ['/parentType', '!==', 'section'],
                ],

                content: {
                    defaultUnit: '%',
                    // allowedUnits: ['%', 'px'],
                    isResponsible: true,
                    label: 'Content Width',
                    template: 'ContainerSize',
                },
            },

            {
                path: 'style/minHeight',
                content: {
                    label: 'Min. Height',
                    allowedUnits: ['px', '%', 'em', 'rem', 'vh'],
                },
            },
            {
                path: 'style/alignItems',
                content: {
                    label: 'Containers Height',
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

            ...alignmentModules,
            {
                path: 'style/gap',
                content: {
                    max: 500,
                    placeholder: 0,
                    defaultUnit: 'px',
                    template: 'Range',
                    isResponsible: true,
                    label: 'Gap Between Elements',
                },
            },
        ],
    },
    {
        hoverControl: false,
        label: 'Advanced Flex Styles',
        modules: [
            {
                path: 'style/flexBasis',
                conditions: [
                    ['configuration/globalWidth', '===', false],
                    '||',
                    ['/configuration', '===', undefined],
                    '&&',
                    ['/parentType', '!==', 'section'],
                ],

                content: {
                    defaultUnit: '%',
                    // allowedUnits: ['%', 'px'],
                    isResponsible: true,
                    label: 'Content Width',
                    template: 'ContainerSize',
                },
            },
            {
                path: 'style/flexDirection',
                content: {
                    isResponsible: true,
                    label: 'Direction',
                    template: 'Tab',
                    inputType: 'boxed',
                    defaultValue: 'row',
                    labelPosition: 'vertical',
                    options: [
                        { value: 'row', label: 'Row', icon: 'far arrow-right' },
                        {
                            value: 'column',
                            label: 'Column',
                            icon: 'far arrow-down',
                        },
                        {
                            value: 'row-reverse',
                            label: 'Reverse row',
                            icon: 'far arrow-left',
                        },
                        {
                            value: 'column-reverse',
                            label: 'Reverse Column',
                            icon: 'far arrow-up',
                        },
                    ],
                },
            },
            {
                path: 'style/justifyContent',
                content: {
                    label: 'Justify Content',
                    template: 'Tab',
                    inputType: 'boxed',
                    // defaultValue: 'flex-start',
                    labelPosition: 'inline',
                    options: [
                        {
                            value: 'unset',
                            label: 'None',
                            icon: 'far times',
                        },
                        {
                            value: 'flex-start',
                            label: 'Start',
                            icon: 'far objects-align-left',
                        },
                        {
                            value: 'center',
                            label: 'Center',
                            icon: 'far objects-align-center-horizontal',
                        },
                        {
                            value: 'flex-end',
                            label: 'End',
                            icon: 'far objects-align-right',
                        },
                        {
                            value: 'space-between',
                            label: 'Between',
                            icon: 'far arrows-left-right-to-line',
                        },
                        {
                            value: 'space-around',
                            label: 'Around',
                            icon: 'far arrows-left-right',
                        },
                        {
                            value: 'space-evenly',
                            label: 'Evenly',
                            icon: 'far distribute-spacing-horizontal',
                        },
                    ],
                },
            },
            {
                path: 'style/alignItems',
                content: {
                    label: 'Align Items',
                    template: 'Tab',
                    inputType: 'boxed',
                    defaultValue: 'center',
                    labelPosition: 'inline',
                    options: [
                        {
                            value: 'unset',
                            label: 'None',
                            icon: 'far times',
                        },
                        {
                            value: 'flex-start',
                            label: 'Start',
                            icon: 'far objects-align-top',
                        },
                        {
                            value: 'center',
                            label: 'Center',
                            icon: 'far objects-align-center-vertical',
                        },
                        {
                            value: 'flex-end',
                            label: 'End',
                            icon: 'far objects-align-bottom',
                        },
                        {
                            value: 'stretch',
                            label: 'Stretch',
                            icon: 'far distribute-spacing-vertical',
                        },
                    ],
                },
            },
            {
                path: 'style/flexWrap',
                content: {
                    label: 'Wrap',
                    template: 'Tab',
                    inputType: 'boxed',
                    defaultValue: 'wrap',
                    isResponsible: true,
                    options: [
                        { value: 'wrap', label: 'Wrap' },
                        { value: 'nowrap', label: 'No Wrap' },
                        { value: 'wrap-reverse', label: 'Reverse' },
                    ],
                },
            },
        ],
    },
    {
        hoverControl: false,
        label: 'Individual Container Styles',
        conditions: ['/parentType', '===', 'container'],
        modules: [
            {
                path: 'containerItem/style/alignSelf',
                content: {
                    label: 'Align Self',
                    template: 'Tab',
                    inputType: 'boxed',
                    defaultValue: '',
                    labelExtra: true,
                    labelPosition: 'inline',
                    isResponsible: true,
                    options: [
                        { value: '', label: 'None', icon: 'far xmark' },
                        {
                            value: 'flex-start',
                            label: 'Start',
                            icon: 'far objects-align-top',
                        },
                        {
                            value: 'center',
                            label: 'Center',
                            icon: 'far objects-align-center-vertical',
                        },
                        {
                            value: 'flex-end',
                            label: 'End',
                            icon: 'far objects-align-bottom',
                        },
                        {
                            value: 'stretch',
                            label: 'Stretch',
                            icon: 'far arrows-from-line',
                        },
                    ],
                },
            },
            {
                path: 'containerItem/style/order',
                content: {
                    label: 'Order',
                    isResponsible: true,
                    defaultValue: 0,
                    template: 'Range',
                    allowedUnits: false,
                },
            },
            {
                path: 'containerItem/style/flexGrow',
                content: {
                    label: 'Flex Grow',
                    isResponsible: true,
                    defaultValue: 0,
                    template: 'Range',
                    allowedUnits: false,
                },
            },
        ],
    },
    {
        label: 'Background',
        modules: makeBgSettings('style', [
            'color'
        ]),
    },
];
