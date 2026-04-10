/*****************************************************
 * Packages
 ******************************************************/
import { getDomainUtils } from '@dorik/utils';
import { Button, Col, Divider, Flex, Row } from 'antd';
import { useContext, useState } from 'react';
import styled from 'styled-components';

/*****************************************************
 * Locals
 ******************************************************/
import BaseModal from 'modules/Shared/Modals/components';
import { antToken } from '../../../antd.theme';
import { STAGE, isDev } from '../../../config';
import DomainContent from './DomainContent';
import { BuilderContext } from 'contexts/BuilderContext';
import { ElementContext } from 'contexts/ElementRenderContext';

const PublishPopOverStc = styled.div`
    &&& {
        .ant-col {
            display: flex;
            padding: 0;
            flex-direction: column;
            gap: 12px;
            overflow: hidden;
        }
        .ant-typography {
            margin: 0;
            color: ${antToken.colorText};
        }
    }
`;

const domainEnv = getDomainUtils(STAGE);

function PublishPopOver({
    t,
    site,
    handleShowPublishPopOver,
    handlePublish,
    handleGotoPublishEnd,
    isPublishEndButtonDisabled,
    isPublishDisabled,
    getPageUrl,
}) {
    const { handleCmsCustomDomain, appName } = useContext(BuilderContext);
    const { handleClickOnPublish } = useContext(ElementContext);
    const [modal, setModal] = useState({});
    const onCancel = () => {
        setModal((prev) => ({ ...prev, open: false }));
    };

    const pageOriginUnderSubDomain =
        appName === 'CMS'
            ? `${site.dorikSitePrefix}.${domainEnv[site.siteType]}${
                  isDev ? '.localhost:3001' : ''
              }`
            : site.url;

    const pageOriginUnderCustomDomain =
        appName === 'CMS'
            ? `${site.domain}${isDev ? '.localhost:3001' : ''}`
            : site.url;

    const handleAddCustomDomain = () => {
        if (appName === 'CMS') {
            handleCmsCustomDomain(handleClickOnPublish);
        } else {
            setModal(() => ({
                onCancel,
                open: true,
                footer: false,
                type: 'customDomain',
                okText: t('Save'),
                cancelText: t('Cancel'),
                title: t('Custom domain'),
                site,
            }));
        }
        handleShowPublishPopOver();
    };

    return (
        <PublishPopOverStc>
            <Row style={{ gap: '12px' }}>
                {site.dorikSitePrefix || site.domainType !== 'CUSTOM' ? (
                    <Col span={24} data-testid="subDomain">
                        <DomainContent
                            t={t}
                            site={site}
                            title={t('Subdomain')}
                            pageUrl={getPageUrl({
                                origin: pageOriginUnderSubDomain,
                            })}
                            isPublishEndButtonDisabled={
                                isPublishEndButtonDisabled
                            }
                            handleGotoPublishEnd={handleGotoPublishEnd}
                        />
                    </Col>
                ) : null}

                <Col span={24} data-testid="customDomain">
                    <DomainContent
                        t={t}
                        site={site}
                        title={t('Custom Domain')}
                        pageUrl={getPageUrl({
                            origin: pageOriginUnderCustomDomain,
                        })}
                        isPublishEndButtonDisabled={isPublishEndButtonDisabled}
                        handleGotoPublishEnd={handleGotoPublishEnd}
                        handleAddCustomDomain={handleAddCustomDomain}
                    />
                </Col>
            </Row>
            <Divider style={{ margin: '12px 0' }} />
            <Flex gap="small" align="center" justify="flex-end">
                <Button
                    size="small"
                    onClick={handleShowPublishPopOver}
                    disabled={isPublishDisabled}
                >
                    {t('Close')}
                </Button>
                <Button
                    type="primary"
                    size="small"
                    onClick={handlePublish}
                    disabled={isPublishDisabled}
                >
                    {t('Publish')}
                </Button>
            </Flex>
            <BaseModal {...modal} />
        </PublishPopOverStc>
    );
}

export default PublishPopOver;
