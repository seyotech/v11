/****************************************************************
 * Packages Import
 ****************************************************************/
import { FontAwesomeIcon } from '@/util/faHelpers';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import {
    Button,
    Col,
    ConfigProvider,
    Empty,
    Form,
    Radio,
    Row,
    Spin,
    Typography,
    Upload,
} from 'antd';
import acceptedFileMeta from 'constants/acceptedFileMeta';
import useManageMedia from 'hooks/media-library/useManageMedia';
import DrawerHeader from 'modules/Shared/DrawerHeader';
import InfiniteScroll from 'modules/Shared/InfiniteScroll/InfiniteScroll';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import validateFiles from 'util/media/validateFiles';
import Fonts from './Fonts';
import Images from './Images';
import Videos from './Videos';
import { entityTypeEnum } from 'constants/mediaEntityTypeEnum';

const MediaLibrary = () => {
    const [form] = Form.useForm();
    const { t } = useTranslation('builder');
    const {
        searchMedia,
        handleUploadMedia,
        handleDeleteMedia,
        handleEditMedia,
        fetchNextPage,
        media: { kind, search, data, hasNextPage },
        isLoading,
        uploading,
    } = useManageMedia();

    useEffect(() => {
        fetchNextPage({ entityType: entityTypeEnum.REGULAR });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getOptions = (style) => {
        const options = [
            {
                label: t('Images'),
                value: 'image',
                style,
            },
            {
                label: t('Videos'),
                value: 'video',
                style,
            },
            // {
            //     label: 'Fonts',
            //     value: 'font',
            //     style,
            // },
        ];
        return options;
    };

    const Libraries = {
        image: Images,
        video: Videos,
        font: Fonts,
    }[kind];

    const optionStyle = {
        flex: 1,
        textAlign: 'center',
    };

    useEffect(() => {
        form.setFieldValue('search', search);
    }, [form, kind, search]);

    return (
        <>
            <Form form={form} style={{ width: '100%', margin: 0 }}>
                <DrawerHeader
                    title={t('Media Library')}
                    onChange={(event) => {
                        searchMedia({
                            event,
                            entityType: entityTypeEnum.REGULAR,
                        });
                    }}
                    extra={
                        kind === 'font' ? null : (
                            <Upload
                                beforeUpload={async (file, files) => {
                                    const lastFile = files.at(-1);
                                    if (file.uid === lastFile.uid) {
                                        const fileList = await validateFiles({
                                            files,
                                            accept: acceptedFileMeta[kind].type,
                                            size: acceptedFileMeta[kind].size,
                                            kind,
                                        });

                                        if (fileList.length < 1) return;

                                        handleUploadMedia({
                                            fileList,
                                            kind,
                                            entityType: entityTypeEnum.REGULAR,
                                        });
                                    }
                                }}
                                data-testid="upload-button"
                                multiple={true}
                                maxCount={10}
                                accept={acceptedFileMeta[kind].type}
                                showUploadList={false}
                                customRequest={() => null}
                            >
                                <ConfigProvider
                                    wave={{
                                        disabled: true,
                                    }}
                                >
                                    <Button
                                        type="primary"
                                        ghost={true}
                                        size="small"
                                        style={{ borderStyle: 'none' }}
                                        loading={uploading}
                                        icon={
                                            <FontAwesomeIcon
                                                icon={icon({
                                                    name: 'upload',
                                                    style: 'light',
                                                })}
                                            />
                                        }
                                    >
                                        <Typography.Text
                                            style={{ color: '#3830B3' }}
                                        >
                                            {t('Upload')}
                                        </Typography.Text>
                                    </Button>
                                </ConfigProvider>
                            </Upload>
                        )
                    }
                >
                    <Col span={24} style={{ paddingInline: 0 }}>
                        <Radio.Group
                            size="small"
                            options={getOptions(optionStyle)}
                            onChange={(event) =>
                                fetchNextPage({
                                    kind: event.target.value,
                                    entityType: entityTypeEnum.REGULAR,
                                })
                            }
                            value={kind}
                            optionType="button"
                            style={{
                                width: '100%',
                                display: 'flex',
                            }}
                        />
                    </Col>
                </DrawerHeader>
            </Form>
            <Row
                gutter={[12, 12]}
                justify="space-between"
                style={{ padding: '0 15px', marginInline: 0 }}
            >
                <Col
                    span={24}
                    style={{
                        paddingInline: 0,
                    }}
                >
                    {!isLoading && data.length < 1 ? (
                        <Empty description={t('Media Not Found')} />
                    ) : (
                        <InfiniteScroll
                            height="100%"
                            hasNextPage={hasNextPage}
                            fetchNextPage={() => {
                                fetchNextPage({
                                    entityType: entityTypeEnum.REGULAR,
                                });
                            }}
                            dataLength={data.length}
                            loader={<Spin />}
                        >
                            <Libraries
                                data={data}
                                handleEditMedia={handleEditMedia}
                                handleDeleteMedia={handleDeleteMedia}
                            />
                        </InfiniteScroll>
                    )}
                </Col>
            </Row>
        </>
    );
};

export default MediaLibrary;
