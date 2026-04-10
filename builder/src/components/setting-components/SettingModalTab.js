import React from 'react';
import ModalTab, { TabOption } from './Modals/ModalTab';

function SettingModalTab({ settings, activeTab, setActiveTab }) {
    const handleTabChange = React.useCallback(
        (payload) => setActiveTab(payload.value),
        []
    );

    return (
        <ModalTab
            type="underlined"
            selected={activeTab}
            onSelect={handleTabChange}
            style={{ textTransform: 'uppercase' }}
        >
            {settings.map((option, index) => (
                <TabOption value={index} key={option.title} icon={option.icon}>
                    {option.title}
                </TabOption>
            ))}
        </ModalTab>
    );
}

export default SettingModalTab;
