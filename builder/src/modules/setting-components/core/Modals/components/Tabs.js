/*****************************************************
 * Packages
 ******************************************************/
import { Radio } from 'antd';
import T from 'prop-types';
import { useTranslation } from 'react-i18next';

function Tabs({ settings, activeTab, setActiveTab }) {
    const { t } = useTranslation();
    const options = settings.map((setting, index) => {
        return {
            value: index,
            label: t(setting.title),
            style: {
                flexGrow: 1,
                fontWeight: 400,
                textAlign: 'center',
            },
        };
    });

    return (
        <Radio.Group
            size="small"
            value={activeTab}
            options={options}
            optionType="button"
            style={{ display: 'flex', width: '100%' }}
            onChange={(event) => setActiveTab(event.target.value)}
        />
    );
}

Tabs.propTypes = {
    settings: T.array.isRequired,
    activeTab: T.string.isRequired,
    setActiveTab: T.func.isRequired,
};

export default Tabs;
