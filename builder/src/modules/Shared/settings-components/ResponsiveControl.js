import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Popover, Space, Tooltip } from 'antd';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ElementContext } from '../../../contexts/ElementRenderContext';

function ResponsiveControl() {
    const { display, handleResponsiveEditorMode } = useContext(ElementContext);
    const { t } = useTranslation('builder');

    const devices = [
        {
            device: 'desktop',
            toolTipText: t('Desktop Screen'),
            iconProps: {
                icon: icon({ name: 'laptop', style: 'regular' }),
            },
        },
        {
            device: 'tablet',
            toolTipText: t('Tablet Screen'),
            iconProps: {
                icon: icon({ name: 'tablet', style: 'regular' }),
            },
        },
        {
            device: 'mobile',
            toolTipText: t('Mobile Screen'),
            iconProps: {
                icon: icon({ name: 'mobile', style: 'regular' }),
            },
        },
    ];

    const activeDevice = devices.find(({ device }) => device === display);

    return (
        <Popover
            trigger={['hover']}
            placement="rightTop"
            arrow={false}
            content={
                <Space direction="vertical" data-testid="responsiveSelect">
                    {devices.map(({ device, toolTipText, iconProps }) => {
                        return (
                            <Button
                                key={device}
                                data-testid={`${device}-button`}
                                type={display === device ? 'default' : 'text'}
                                size="small"
                                icon={
                                    <FontAwesomeIcon
                                        data-testid={`${device}-icon`}
                                        {...iconProps}
                                        style={{ color: '#747192' }}
                                    />
                                }
                                onClick={() =>
                                    handleResponsiveEditorMode(device)
                                }
                            />
                        );
                    })}
                </Space>
            }
            overlayInnerStyle={{
                padding: '0.25rem 0.5rem',
            }}
        >
            <Tooltip title={activeDevice.toolTipText}>
                <Button
                    data-testid={`active-display-button`}
                    size="small"
                    type="text"
                    icon={
                        <FontAwesomeIcon
                            data-testid={`${activeDevice.device}-icon`}
                            {...activeDevice.iconProps}
                            style={{ color: '#747192' }}
                        />
                    }
                />
            </Tooltip>
        </Popover>
    );
}

export default ResponsiveControl;
