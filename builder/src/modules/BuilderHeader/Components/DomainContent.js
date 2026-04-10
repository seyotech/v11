/*****************************************************
 * Packages
 ******************************************************/
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Space, Tooltip, Typography } from 'antd';

/*****************************************************
 * Locals
 ******************************************************/
import { antToken } from '../../../antd.theme';

const DomainContent = ({
    t,
    title,
    site,
    pageUrl,
    isPublishEndButtonDisabled,
    handleGotoPublishEnd,
    handleAddCustomDomain,
}) => {
    return (
        <>
            <Space size={4}>
                <Typography.Title level={5}>{t(title)}</Typography.Title>
                <Tooltip placement={'rightTop'} title={t(title)}>
                    <FontAwesomeIcon
                        fixedWidth
                        style={{
                            color: '#45426e',
                        }}
                        icon={icon({
                            name: 'info-circle',
                            style: 'regular',
                        })}
                    />
                </Tooltip>
            </Space>
            <Space size={2} direction="vertical">
                {site.domainType !== 'CUSTOM' && handleAddCustomDomain ? (
                    <Button
                        size="small"
                        type="link"
                        onClick={handleAddCustomDomain}
                        style={{ padding: 0 }}
                    >
                        {`+ ${t('Add Custom Domain')}`}
                    </Button>
                ) : (
                    <Space size={4}>
                        <Typography.Text
                            {...{
                                ellipsis: {
                                    tooltip: pageUrl,
                                },
                            }}
                            style={{ maxWidth: '300px', cursor: 'pointer' }}
                            onClick={() => {
                                handleGotoPublishEnd(pageUrl);
                            }}
                        >
                            {pageUrl}
                        </Typography.Text>
                        <Tooltip
                            placement={'rightTop'}
                            title={t('Go to publish end')}
                        >
                            <span
                                onClick={() => {
                                    handleGotoPublishEnd(pageUrl);
                                }}
                                disabled={isPublishEndButtonDisabled}
                                data-testid="gotoPunblishEnd"
                            >
                                <FontAwesomeIcon
                                    icon={icon({
                                        name: 'arrow-up-right-from-square',
                                        style: 'regular',
                                    })}
                                    style={{
                                        color: antToken.colorPrimary,
                                        cursor: 'pointer',
                                    }}
                                />
                            </span>
                        </Tooltip>
                    </Space>
                )}
            </Space>
        </>
    );
};

export default DomainContent;
