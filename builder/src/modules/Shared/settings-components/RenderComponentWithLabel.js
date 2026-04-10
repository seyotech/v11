/*****************************************************
 * Packages
 ******************************************************/

import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Row, Space, Tooltip, Typography } from 'antd';
/*****************************************************
 * Local
 ******************************************************/

import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import DropdownInput from 'components/setting-components/DropdownInput/CmsDropdown';
import RenderHelpText from 'components/setting-components/core/RenderHelpText';
import useCMS from 'hooks/useCmsRow';
import isEmpty from 'lodash.isempty';
import ResponsiveControl from 'modules/Shared/settings-components/ResponsiveControl';
import { renderCMSInput } from 'util/cmsConditions';
import { FeatureLock } from 'modules/FeatureLock';

const RenderComponentWithLabel = ({ labelExtra, children, ...rest }) => {
    const context = useCMS();
    const { t } = useTranslation('builder');
    const {
        module = rest,
        name,
        value,
        onChange,
        disabled,
        activeHover,
        hasError = false,
        errors = [],
        customMenuClick,
        enabled = true,
    } = rest;

    const shouldRenderCompoundLabel = !!module.label && !module.isRootLabel;
    const shouldRenderResponsiveControl = module.isResponsible && !activeHover;
    const shouldRenderCmsFieldDropDown =
        !!module.cmsFields && !isEmpty(context) && renderCMSInput(module);
    const shouldRenderInlineComponent =
        (!!labelExtra || module.labelPosition === 'inline') && enabled;
    const enableRightCol =
        shouldRenderInlineComponent || shouldRenderCmsFieldDropDown;
    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            {shouldRenderCompoundLabel && (
                <Row
                    align={'middle'}
                    justify={'space-between'}
                    gutter={[8, 8]}
                    data-testid="compoundLabel"
                >
                    {
                        <Col flex={1}>
                            <Space size={4}>
                                <Typography.Text>
                                    {t(module.label)}
                                </Typography.Text>
                                {shouldRenderResponsiveControl && (
                                    <ResponsiveControl />
                                )}
                                {module.info && (
                                    <Col>
                                        <Tooltip
                                            placement={'leftTop'}
                                            title={t(module.info)}
                                        >
                                            <Button
                                                size="small"
                                                type="text"
                                                icon={
                                                    <FontAwesomeIcon
                                                        fixedWidth
                                                        style={{
                                                            color: '#45426e',
                                                        }}
                                                        icon={icon({
                                                            name: 'info-circle',
                                                            style: 'solid',
                                                        })}
                                                    />
                                                }
                                                data-testid="infoButton"
                                            />
                                        </Tooltip>
                                    </Col>
                                )}
                                {module.isFeatureLocked && (
                                    <FeatureLock
                                        isLocked={true}
                                        style={{ right: 'unset' }}
                                    />
                                )}
                            </Space>
                        </Col>
                    }

                    {enableRightCol && (
                        <Col
                            flex={1}
                            {...(module.labelExtraDirection === 'vertical' && {
                                span: 24,
                                order: 3,
                            })}
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}
                        >
                            {/* extra label component or inline component goes here */}
                            {shouldRenderInlineComponent
                                ? module.labelPosition === 'inline'
                                    ? children
                                    : labelExtra
                                : null}
                            {shouldRenderCmsFieldDropDown && (
                                <DropdownInput
                                    disabled={disabled}
                                    {...{ name, value, onChange }}
                                    customMenuClick={customMenuClick}
                                    cmsFields={module.cmsFields}
                                />
                            )}
                        </Col>
                    )}
                </Row>
            )}

            {enabled ? (
                <>
                    {/* non-inline setting component goes here */}
                    {module.labelPosition !== 'inline' && children}

                    {!!module.helpText && (
                        <RenderHelpText helpText={module.helpText} t={t} />
                    )}
                    {!hasError ? null : (
                        <div style={{ color: 'red' }}>{errors.join(', ')}</div>
                    )}
                </>
            ) : (
                <a href="/dashboard/account/billing" target="_blank">
                    {t('Upgrade to Pro')}
                </a>
            )}
        </Space>
    );
};

export default RenderComponentWithLabel;
