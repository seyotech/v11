import { Button, Modal, Tooltip } from 'antd';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

import { BuilderContext } from 'contexts/BuilderContext';

import { antToken } from '../../antd.theme';

export const FeatureLock = ({ children, isLocked, style }) => {
    const [open, setOpen] = useState(false);

    const { t } = useTranslation('builder');
    const { dorikAppURL, useLimit } = useContext(BuilderContext);

    const { hasPricingPagePermission } = useLimit();
    const hasPricingPageAccess = hasPricingPagePermission();

    if (!isLocked) return children ? children({}) : null;

    const navigateToPricingPage = () => {
        window.open(`${dorikAppURL}/dashboard/pricing/plans`);
    };

    return (
        <div style={{ position: 'relative' }}>
            {children &&
                children({
                    style: { paddingRight: 24 },
                    btnStyle: { paddingRight: 32 },
                })}
            <Tooltip
                title={t(
                    'Unlock with a premium plan. Click the lock icon for more info.'
                )}
            >
                <Button
                    style={{
                        right: 0,
                        top: '50%',
                        fontSize: 13,
                        cursor: 'pointer',
                        position: 'absolute',
                        transform: 'translateY(-50%)',
                        ...style,
                    }}
                    type="text"
                    size="small"
                    onClick={() => setOpen(true)}
                    icon={
                        <FontAwesomeIcon
                            fixedWidth
                            color={antToken.colorPrimary}
                            icon={icon({ name: 'lock', style: 'solid' })}
                        />
                    }
                    data-testid="lockButton"
                />
            </Tooltip>
            <Modal
                centered
                open={open}
                cancelText="No thanks"
                okText="View site plans"
                title="Feature Restricted"
                onOk={navigateToPricingPage}
                onCancel={() => setOpen(false)}
                {...(!hasPricingPageAccess && { footer: null })}
            >
                <p>
                    {hasPricingPageAccess
                        ? t(
                              'This feature is not part of your current plan. To gain access, please upgrade your subscription.'
                          )
                        : t(
                              'Please inform the site owner that this feature is not included in the current plan. To access it, they will need to upgrade their subscription.'
                          )}
                </p>
            </Modal>
        </div>
    );
};
