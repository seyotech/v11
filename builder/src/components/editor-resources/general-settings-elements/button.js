import { TEXT_WITHOUT_RICH_TEXT } from '../../../util/fieldTypes';
import { backgroundStyles } from '../compound-settings';

export const button = [
    {
        label: 'Button Type & Contents',
        modules: [
            {
                path: 'content',
                content: {
                    cmsFields: TEXT_WITHOUT_RICH_TEXT,
                    template: 'Input',
                    label: 'Button Text',
                    inputType: 'input',
                    enableAI: true,
                },
            },
            {
                path: 'style/justifyContent',
                content: {
                    label: 'Text Align',
                    isResponsible: true,
                },
                conditions: [
                    ['style/width', '!=', null],
                    '&&',
                    ['style/width', '!==', 'auto'],
                ],
            },
            {
                path: 'wrapper/textAlign',
                conditions: [
                    ['style/width', '===', 'auto'],
                    '||',
                    ['style/width', '==', null],
                ],
            },
            {
                path: 'style/color',
                conditions: ['settings/buttonType', '!==', 'icon-only'],
            },
            {
                path: 'style/fontSize',
                conditions: ['settings/buttonType', '!==', 'icon-only'],
            },
            {
                path: 'style/fontWeight',
                conditions: ['settings/buttonType', '!==', 'icon-only'],
            },
            {
                hoverable: false,
                isResponsible: true,
                template: 'FontSpaceLH',
                conditions: ['settings/buttonType', '!==', 'icon-only'],
                modules: ['style/lineHeight', 'style/letterSpacing'],
            },
            {
                modules: [
                    {
                        hoverable: true,
                        isResponsible: true,
                        label: 'Shadow Offset & Blur',
                        modules: [
                            'style/textShadow/x',
                            'style/textShadow/y',
                            'style/textShadow/blur',
                        ],
                    },
                    'style/textShadow/color',
                ],
                conditions: [
                    ['settings/buttonType', '!==', 'icon-only'],
                    '&&',
                    ['style/textShadow/_enabled', '===', true],
                ],
            },
        ],
    },
    {
        label: 'Button Background',
        modules: backgroundStyles,
    },
    {
        hoverControl: false,
        label: 'Inline Button',
        conditions: ['/parentType', '!==', 'container'],
        modules: [
            {
                path: 'settings/inlineButton',
                content: {
                    onValue: true,
                    onLabel: 'ON',
                    offValue: false,
                    offLabel: 'OFF',
                    template: 'Switch',
                    labelPosition: 'inline',
                    defaultValue: false,
                    label: 'Inline with other buttons',
                },
            },
        ],
    },
];
