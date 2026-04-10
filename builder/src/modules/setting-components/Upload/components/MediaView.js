import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Button,
    Col,
    Empty,
    Image,
    Popconfirm,
    Row,
    Space,
    Tooltip,
    Typography,
} from 'antd';
import InfiniteScroll from 'modules/Shared/InfiniteScroll/InfiniteScroll';
import Video from 'modules/Shared/Video/Video';
import { useGetFileURL } from 'modules/Shared/hooks/useGetFileURL';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import showNotification from 'util/media/showNotification';
import ucFirst from 'util/ucFirst';
import { FileUploadContext } from '../context/FileUploadContext';
import {
    MediaOverlay,
    MediaOverlayFooter,
    MediaStc,
    MediaViewStc,
} from './Upload.stc';
import { entityTypeEnum } from 'constants/mediaEntityTypeEnum';

const { Text } = Typography;

const MediaView = () => {
    const {
        type,
        isLoading,
        onSuccess,
        fetchNextPage,
        handleDeleteMedia,
        media: { data, hasNextPage },
    } = useContext(FileUploadContext);
    const getFileURL = useGetFileURL();
    const { t } = useTranslation('builder');

    const isVideo = type === 'video';

    useEffect(() => {
        fetchNextPage({ kind: type, entityType: entityTypeEnum.REGULAR });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCopyFileUrl = (url) => {
        navigator.clipboard.writeText(url);
        showNotification({
            type: 'success',
            message: t('The File URL copied to the Clipboard'),
        });
    };

    if (!isLoading && 0 === data?.length)
        return (
            <MediaViewStc>
                <Empty
                    rootClassName="no-data"
                    description={t(`No {{type}} Found`, {
                        type: ucFirst(type),
                    })}
                />
                ;
            </MediaViewStc>
        );

    return (
        <MediaViewStc>
            <InfiniteScroll
                hasNextPage={hasNextPage}
                fetchNextPage={() =>
                    fetchNextPage({ entityType: entityTypeEnum.REGULAR })
                }
                dataLength={data?.length}
                height={427}
            >
                <Row gutter={[8, 16]}>
                    {data.map((file) => (
                        <Col key={file.id} span={6}>
                            <MediaStc>
                                {isVideo ? (
                                    <Video
                                        name={file.name}
                                        src={getFileURL(file.path)}
                                    />
                                ) : (
                                    <Image
                                        width="100%"
                                        height="100%"
                                        src={getFileURL(file.path)}
                                        data-testid={file.name}
                                        alt={file.name}
                                        preview={false}
                                        style={{
                                            objectFit: 'cover',
                                        }}
                                    />
                                )}
                                <MediaOverlay className="media-overlay">
                                    <Button
                                        type="primary"
                                        onClick={() =>
                                            onSuccess(getFileURL(file.path))
                                        }
                                    >
                                        {t('Insert')}
                                    </Button>

                                    <MediaOverlayFooter>
                                        <Text
                                            ellipsis={true}
                                            style={{
                                                width: '70%',
                                                color: '#fff',
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            {file.name}
                                        </Text>
                                        <Space size={16}>
                                            <Tooltip title={t('Delete')}>
                                                <Popconfirm
                                                    title={t(`Delete`)}
                                                    description={t(
                                                        `Are you sure to delete this {{file}}`,
                                                        { file: file?.kind }
                                                    )}
                                                    onConfirm={() =>
                                                        handleDeleteMedia({
                                                            id: file.id,
                                                            kind: type,
                                                        })
                                                    }
                                                    okText={t('Yes')}
                                                    cancelText={t('No')}
                                                    placement="right"
                                                >
                                                    <FontAwesomeIcon
                                                        data-testid="media-remove"
                                                        icon={icon({
                                                            name: 'trash',
                                                            style: 'light',
                                                        })}
                                                    />
                                                </Popconfirm>
                                            </Tooltip>

                                            <Tooltip title={t('Copy link')}>
                                                <FontAwesomeIcon
                                                    data-testid="media-link"
                                                    onClick={() =>
                                                        handleCopyFileUrl(
                                                            getFileURL(
                                                                file.path
                                                            )
                                                        )
                                                    }
                                                    icon={icon({
                                                        name: 'link',
                                                        style: 'light',
                                                    })}
                                                />
                                            </Tooltip>
                                        </Space>
                                    </MediaOverlayFooter>
                                </MediaOverlay>
                            </MediaStc>
                        </Col>
                    ))}
                </Row>
            </InfiniteScroll>
        </MediaViewStc>
    );
};

export default MediaView;
