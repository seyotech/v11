import SettingsTab from './SettingsTab';
import pageMeta from './page-settings/page-meta';
import pageBasic from './page-settings/page-basic';
import _advancedPageSettings from './page-settings/advanced-page-settings';

const advancedPageSettings = {
    ..._advancedPageSettings,
    default: _advancedPageSettings.default.filter(
        ({ label }) => label !== 'Site Settings & SEO'
    ),
};

const configIntegration = [
    new SettingsTab({
        title: 'Basic',
        icon: ['far', 'bars'],
        content: pageBasic,
    }),
    new SettingsTab({
        icon: ['far', 'plug'],
        title: 'Page Meta',
        content: pageMeta,
    }),
    new SettingsTab({
        title: 'Advanced',
        content: advancedPageSettings,
        icon: ['far', 'laptop-code'],
    }),
];

export default configIntegration;
