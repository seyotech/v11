import SettingsTab from './SettingsTab';
import integrationResources from './integration-resources';
import advancedPageSettings from './page-settings/advanced-page-settings';

const siteConfigResources = {
    default: [
        {
            hoverControl: false,
            label: 'Site Language',
            modules: [
                {
                    path: 'settings/general/lang',
                    content: {
                        label: 'Site Language',
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
                            { name: 'Left To Right (LTR)', value: 'ltr' },
                            { name: 'Right To Left (RTL)', value: 'rtl' },
                        ],
                    },
                },
            ],
        },
        {
            hoverControl: false,
            label: 'Favicon & Social Media Image',
            modules: [
                {
                    path: 'settings/meta/favicon',
                    content: {
                        label: 'Favicon',
                        accept: 'image/*',
                        imageType: 'favicon',
                        template: 'ImagePreview',
                    },
                },
                {
                    path: 'settings/meta/og:image',
                    content: {
                        accept: 'image/*',
                        imageType: 'og:image',
                        template: 'ImagePreview',
                        label: 'Social Media Image',
                        info: 'Recommended 1200px x 630px',
                    },
                },
            ],
        },
    ],
};

const advancedSiteSettings = {
    ...advancedPageSettings,
    default: advancedPageSettings.default.filter(
        ({ label }) => label !== 'Page Access'
    ),
};

export default [
    new SettingsTab({
        title: 'General',
        icon: ['far', 'bars'],
        content: siteConfigResources,
    }),
    new SettingsTab({
        icon: ['far', 'plug'],
        title: 'Integrations',
        content: integrationResources,
    }),
    new SettingsTab({
        title: 'Advanced',
        content: advancedSiteSettings,
        icon: ['far', 'laptop-code'],
    }),
];
