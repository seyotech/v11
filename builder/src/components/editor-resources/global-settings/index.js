import SettingsTab from '../SettingsTab';
import customFonts from './customFonts';
import styles from './styles';

const savedColorsSettings = {
    default: [
        {
            hoverControl: false,
            label: 'Solid',
            modules: [
                {
                    template: 'GlobalSavedColors',
                },
            ],
        },
    ],
};

const globalSettings = [
    new SettingsTab({
        title: 'Styles',
        content: styles,
        icon: ['far', 'pencil-paintbrush'],
    }),
    new SettingsTab({
        title: 'Colors',
        icon: ['far', 'globe'],
        content: savedColorsSettings,
    }),
    new SettingsTab({
        content: customFonts,
        title: 'Fonts',
        icon: ['fad', 'font-case'],
    }),
];

export default globalSettings;
