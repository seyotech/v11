import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Space, Tooltip } from 'antd';
import { useContext } from 'react';
import { ElementContext } from '../../../contexts/ElementRenderContext';
/**
 * @component
 * @param {Object} props - The component's props.
 * @param {function} props.t - translation function
 * @returns {JSX.Element}
 */

function TopCenter({ t }) {
    const { display, handleResponsiveEditorMode } = useContext(ElementContext);
    return (
        <Space
            style={{
                borderInline: '1px solid #F0F0F0',
                padding: '0 16px',
            }}
        >
            {[
                {
                    device: 'desktop',
                    toolTipText: t('Desktop Screen'),
                    icon: (
                        <FontAwesomeIcon
                            data-testid="desktop-icon"
                            icon={regular('laptop')}
                        />
                    ),
                },
                {
                    device: 'tablet',
                    toolTipText: t('Tablet Screen'),
                    icon: (
                        <FontAwesomeIcon
                            data-testid="tablet-icon"
                            icon={regular('tablet-button')}
                        />
                    ),
                },
                {
                    device: 'mobile',
                    toolTipText: t('Mobile Screen'),
                    icon: (
                        <FontAwesomeIcon
                            data-testid="mobile-icon"
                            icon={regular('mobile-button')}
                        />
                    ),
                },
            ].map(({ device, toolTipText, icon }) => {
                return (
                    <Tooltip key={device} title={toolTipText}>
                        <Button
                            data-testid={`${device}-button`}
                            type={display === device ? 'primary' : 'default'}
                            size="small"
                            icon={icon}
                            onClick={() => handleResponsiveEditorMode(device)}
                        />
                    </Tooltip>
                );
            })}
        </Space>
    );
}

export default TopCenter;
