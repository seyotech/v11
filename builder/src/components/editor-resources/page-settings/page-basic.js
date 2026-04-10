import uuid from '../../../util/uniqId';
import { TEXT_WITHOUT_RICH_TEXT } from '../../../util/fieldTypes';

const popupSetting = ({ path, label }) => [
    {
        path: `${path}/id`,
        content: {
            label,
            template: 'PopupRows',
        },
    },
    {
        path: `${path}/repeatedly`,
        content: {
            label: 'Show it repeatedly',
            offLabel: 'OFF',
            onLabel: 'ON',
            labelPosition: 'inline',
            template: 'Switch',
            onValue: true,
            test: true,
            offValue: false,
            onChange: ({ name, value }) => {
                return [
                    { name, value },
                    { name: `${path}/suffixId`, value: uuid() },
                ];
            },
        },
    },
];

const pageBasic = {
    default: [
        {
            hoverControl: false,
            label: 'Page Title & Description',
            modules: [
                {
                    path: 'settings/meta/title',
                    content: {
                        template: 'Input',
                        label: 'Page Title',
                        enableAI: true,
                        addOptions: true,
                        cmsFields: TEXT_WITHOUT_RICH_TEXT,
                    },
                },
                {
                    path: 'settings/meta/description',
                    content: {
                        enableAI: true,
                        template: 'Input',
                        inputType: 'textarea',
                        label: 'Page Description',
                        addOptions: true,
                        cmsFields: TEXT_WITHOUT_RICH_TEXT,
                    },
                },
            ],
        },
        {
            hoverControl: false,
            label: 'Page Language',
            modules: [
                {
                    path: 'settings/general/lang',
                    content: {
                        label: 'Page Language',
                        template: 'LanguageSelection',
                        onChange(input) {
                            if (
                                ['ar', 'he', 'iw', 'ku', 'ur'].includes(
                                    input.value
                                )
                            ) {
                                return [
                                    input,
                                    {
                                        name: 'settings/general/langDirection',
                                        value: 'rtl',
                                    },
                                ];
                            }
                            return [
                                input,
                                {
                                    name: 'settings/general/langDirection',
                                    value: 'ltr',
                                },
                            ];
                        },
                    },
                },
                {
                    path: 'settings/general/langDirection',
                    content: {
                        label: 'Language Direction',
                        template: 'Select',
                        options: [
                            { name: 'Default', value: '' },
                            { name: 'Left To Right (LTR)', value: 'ltr' },
                            { name: 'Right To Left (RTL)', value: 'rtl' },
                        ],
                    },
                },
            ],
        },
    ],
};

export default pageBasic;
