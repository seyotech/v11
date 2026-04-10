import { icon, regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Divider, Popover, Space, Tooltip, Typography } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';

import useClickOutside from 'hooks/useClickOutside';
import { MoreMenu } from 'modules/Menu';
import { ElementContext } from '../../../contexts/ElementRenderContext';
import { BuilderContext } from '../../../contexts/BuilderContext';
import PublishPopOver from './PublishPopOver';
import { Trans } from 'react-i18next';

/**
 * Represents a component that receives props from BuilderHeader.
 * @typedef {Object} site
 * @property {string} status - Indicates whether the site is PUBLISHED or DRAFT.
 *
 *
 * @typedef {Object} builderProps
 * @property {Boolean} authUser - Indicates whether the user is authenticated or not.
 * @property {HTMLAnchorElement} Link - An HTML anchor element for navigation.
 * @property {site} site - site data
 *
 * @component
 *
 * @param {Object} Props - The props for this component.
 * @param {builderProps} props.builderProps - Props passed from Builder.js.
 * @param {function} props.t - translation function
 * @param {function} props.getPageUrl - to get current page's publish end url
 * @param {function} props.handleGotoPublishEnd - to go to the publish end
 * @returns {JSX.Element} A JSX element representing this component.
 */

function TopRight({ builderProps, t, getPageUrl, handleGotoPublishEnd }) {
    const {
        currentPageInfo,
        hasPrev,
        hasNext,
        handleUndo,
        handleRedo,
        previewSite,
        activeSidebar,
        handleSaveData,
        isThumbnailUploading,
        handleClickOnPublish,
        handleIsAutoSaving,
        autoSaving,
        handleShowPublishPopOver,
    } = useContext(ElementContext);

    const {
        versionHistory: { isVersionHistoryClicked: isVersionHistoryProcessing },
        isSaved,
        isSaving,
        isPublishing,
        appName,
    } = useContext(BuilderContext);

    const { authUser, Link, site } = builderProps;
    const [showSavingIndicator, setShowSavingIndicator] = useState(false);
    const prevAutoSaving = useRef(false);
    const visible = activeSidebar === 'PUBLISH-SETTINGS';

    const [active, setActive] = useState(false);
    const ref = useClickOutside(() => {
        setActive(false);
    });

    useEffect(() => {
        prevAutoSaving.current = autoSaving;
        if (isSaving || isSaved) {
            setShowSavingIndicator(true);
            const timer = setTimeout(() => {
                autoSaving && handleIsAutoSaving(false);
            }, 3000);

            return () => {
                setShowSavingIndicator(false);
                clearTimeout(timer);
            };
        }
    }, [isSaved, isSaving, isPublishing]);

    const savingIndicatorText = () => {
        if (isPublishing) {
            return t('Publishing...');
        } else if (isSaving) {
            return t('Saving...');
        } else if (isSaved) {
            return prevAutoSaving.current ? t('Auto Saved') : t('Saved');
        }
        return '';
    };

    const isPublishEndButtonDisabled =
        (appName === 'STATIC' && site.url) ||
        isVersionHistoryProcessing ||
        currentPageInfo.ref === 'SUBSCRIPTION_BANNER';

    const isPublishDisabled =
        isPublishing || isVersionHistoryProcessing || isThumbnailUploading;

    return (
        <Space
            align="center"
            split={
                <Divider
                    type="vertical"
                    style={{
                        height: '40px',
                    }}
                />
            }
            size={0}
            style={{
                justifyContent: 'flex-end',
                width: '100%',
            }}
        >
            {showSavingIndicator ? (
                <Space
                    data-testid="indicator"
                    align="center"
                    style={{
                        padding: '0 16px',
                    }}
                >
                    {isSaved && !isSaving && !isPublishing && (
                        <FontAwesomeIcon
                            icon={regular('check')}
                            style={{ color: '#747192' }}
                            data-testid="checkIcon"
                        />
                    )}
                    <Typography.Text
                        style={{ whiteSpace: 'nowrap' }}
                    >{`${savingIndicatorText()}`}</Typography.Text>
                </Space>
            ) : (
                ''
            )}

            <Space align="center">
                <Tooltip title={t('Undo')}>
                    <Button
                        data-testid="undoButton"
                        size="small"
                        disabled={!hasPrev || isVersionHistoryProcessing}
                        onClick={handleUndo}
                        type="text"
                        icon={
                            <FontAwesomeIcon
                                icon={regular('arrow-rotate-left')}
                                style={{ color: '#747192' }}
                                data-testid="undoIcon"
                            />
                        }
                    />
                </Tooltip>
                <Tooltip title={t('Redo')}>
                    <Button
                        data-testid="redoButton"
                        size="small"
                        disabled={!hasNext || isVersionHistoryProcessing}
                        type="text"
                        onClick={handleRedo}
                        icon={
                            <FontAwesomeIcon
                                icon={regular('arrow-rotate-right')}
                                style={{ color: '#747192' }}
                                data-testid="redoIcon"
                            />
                        }
                    />
                </Tooltip>
            </Space>

            {authUser ? (
                <>
                    <Tooltip title={t('Preview')}>
                        <Button
                            data-testid="previewButton"
                            size="small"
                            disabled={
                                isVersionHistoryProcessing ||
                                currentPageInfo.ref === 'SUBSCRIPTION_BANNER'
                            }
                            onClick={previewSite}
                            type="text"
                            icon={
                                <FontAwesomeIcon
                                    icon={regular('play')}
                                    style={{ color: '#747192' }}
                                    data-testid="previewIcon"
                                />
                            }
                        />
                    </Tooltip>

                    <Space align="center">
                        <Button
                            className="_jr-save-site"
                            data-testid={`save-button`}
                            type="default"
                            size="small"
                            disabled={
                                isPublishing ||
                                isSaving ||
                                isVersionHistoryProcessing
                            }
                            onClick={handleSaveData}
                        >
                            {t('Save')}
                        </Button>

                        <Popover
                            open={visible}
                            trigger={['click']}
                            placement={'bottomRight'}
                            showArrow={true}
                            title={
                                <>
                                    {t('Publish Your Website')}
                                    <Divider style={{ margin: '12px 0' }} />
                                </>
                            }
                            content={
                                <PublishPopOver
                                    t={t}
                                    site={site}
                                    isPublishEndButtonDisabled={
                                        isPublishEndButtonDisabled
                                    }
                                    isPublishDisabled={isPublishDisabled}
                                    handleShowPublishPopOver={
                                        handleShowPublishPopOver
                                    }
                                    handlePublish={handleClickOnPublish}
                                    handleGotoPublishEnd={handleGotoPublishEnd}
                                    getPageUrl={getPageUrl}
                                />
                            }
                            overlayInnerStyle={{
                                padding: '1rem',
                            }}
                            overlayStyle={{
                                width: '23.5rem',
                                top: '40px',
                            }}
                        >
                            <Button
                                className=" _jr-publish-site"
                                data-testid={`publish-button`}
                                type="primary"
                                size="small"
                                disabled={isPublishDisabled}
                                onClick={handleShowPublishPopOver}
                            >
                                {t('Publish')}
                                <FontAwesomeIcon
                                    style={{ marginLeft: 4 }}
                                    icon={icon({
                                        name: 'chevron-down',
                                        style: 'regular',
                                    })}
                                    data-testid="bars"
                                />
                            </Button>
                        </Popover>
                    </Space>
                    <MoreMenu>
                        <Button
                            ref={ref}
                            size="small"
                            type={active ? 'primary' : 'default'}
                            onClick={() => setActive((t) => !t)}
                            icon={
                                <FontAwesomeIcon
                                    icon={icon({
                                        name: 'bars',
                                        style: 'regular',
                                    })}
                                    data-testid="bars"
                                />
                            }
                        />
                    </MoreMenu>
                </>
            ) : (
                <Space>
                    <Trans ns="builder" i18nKey="signupOrLoginToPublish">
                        <Link
                            href={{
                                pathname: '/signup',
                                state: {
                                    from: '/builder',
                                },
                            }}
                        >
                            Sign Up
                        </Link>
                        or
                        <Link
                            href={{
                                pathname: '/login',
                                state: {
                                    from: '/builder',
                                },
                            }}
                        >
                            Login
                        </Link>
                        to Publish
                    </Trans>
                </Space>
            )}
        </Space>
    );
}

export default TopRight;
