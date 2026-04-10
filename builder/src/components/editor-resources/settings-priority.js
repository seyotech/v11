import advanced from './advanced-settings-priority';
import general from './general-settings-priority';
import design from './design-settings-priority';
import SettingsTab from './SettingsTab';

const settings = [
    new SettingsTab({
        title: 'General',
        content: general,
        icon: ['far', 'bars'],
    }),
    new SettingsTab({
        title: 'Styles',
        content: design,
        icon: ['far', 'pencil-paintbrush'],
    }),
    new SettingsTab({
        title: 'Advanced',
        content: advanced,
        icon: ['far', 'laptop-code'],
    }),
];

export default settings;
