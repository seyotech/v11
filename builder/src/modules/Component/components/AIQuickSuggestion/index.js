import { Divider, Space, Typography } from 'antd';
import { BuilderContext } from 'contexts/BuilderContext';
import AntCollapse from 'modules/Shared/AntCollapse';
import DrawerHeader from 'modules/Shared/DrawerHeader';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SimpleBar from 'simplebar-react';
import ColorPanel from './ColorPanel';
import FontSettings from './FontSettings';
import { Label } from './style.stc';
import useSuggestion from './useSuggestion';

const getItems = ({ panelStyle, t, ...rest }) => [
    {
        style: panelStyle,
        key: 'aiQuickPanel',
        children: (
            <Space direction="vertical">
                <ColorPanel {...rest} />
                <Divider />
                <FontSettings {...rest} />
            </Space>
        ),
        label: (
            <Label>
                <Typography.Text strong>
                    {t('AI Colors & Typography')}
                </Typography.Text>
            </Label>
        ),
    },
];

function AIQuickSuggestion() {
    const { appName } = useContext(BuilderContext);
    const isCMSBuilder = appName === 'CMS';
    const { t } = useTranslation('builder');
    const [siteConfig, setSiteConfig] = useState({});
    const { aiSuggestion, getAISuggestion, isLoading } = useSuggestion();

    useEffect(() => {
        !aiSuggestion && getAISuggestion();
    }, []);

    return (
        <div>
            <DrawerHeader title={t('AI Quick Style')} />
            <SimpleBar
                style={{
                    maxHeight: 660,
                    padding: '0 12px',
                    margin: '0 -12px',
                    overflowX: 'hidden',
                }}
            >
                <AntCollapse
                    defaultActiveKey={['aiQuickPanel']}
                    items={getItems({
                        t,
                        siteConfig,
                        setSiteConfig,
                        isCMSBuilder,
                        getAISuggestion,
                        data: aiSuggestion,
                        isLoading,
                    })}
                />
            </SimpleBar>
        </div>
    );
}

export default AIQuickSuggestion;
