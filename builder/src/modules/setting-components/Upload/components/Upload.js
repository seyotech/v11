import {
    Upload as AntUpload,
    Button,
    Col,
    Divider,
    Row,
    Spin,
    Typography,
} from 'antd';
import { useGetFileURL } from 'modules/Shared/hooks/useGetFileURL';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import validateFiles from 'util/media/validateFiles';
import { FileUploadContext } from '../context/FileUploadContext';
import { entityTypeEnum } from 'constants/mediaEntityTypeEnum';

const { Dragger } = AntUpload;
const { Title, Text } = Typography;

const UploadStc = styled.div`
    width: 100%;
    height: 476px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const DraggerSrc = styled.div`
    width: 100%;
    height: 100%;
`;

const Upload = ({ entityType = entityTypeEnum.REGULAR }) => {
    const {
        size,
        type,
        accept,
        onSuccess,
        uploading,
        handleUploadMedia: uploadMedia,
    } = useContext(FileUploadContext);
    const getFileURL = useGetFileURL();
    const { t } = useTranslation('builder');

    const handleUploadMedia = async (params) => {
        const data = await uploadMedia(params);
        onSuccess(getFileURL(data[0].path));
    };
    return (
        <UploadStc>
            <DraggerSrc>
                <Dragger
                    accept={accept}
                    showUploadList={false}
                    customRequest={() => null}
                    beforeUpload={async (file, files) => {
                        const lastFile = files.at(-1);
                        if (file.uid === lastFile.uid) {
                            const fileList = await validateFiles({
                                files,
                                size,
                                accept,
                                kind: type,
                            });
                            if (fileList.length < 1) return;
                            handleUploadMedia({
                                fileList,
                                kind: type,
                                entityType,
                            });
                        }
                    }}
                >
                    {uploading ? (
                        <Spin loading={uploading} tip={t('Uploading...')}>
                            <span data-testid="spinner-text" />
                        </Spin>
                    ) : (
                        <>
                            <Title
                                level={3}
                                style={{ color: '#0C0A25', marginBottom: 10 }}
                            >
                                {t('Drag Media to Upload in Library')}
                            </Title>
                            <Row
                                align="middle"
                                gutter={[16, 16]}
                                style={{ flexDirection: 'column' }}
                            >
                                <Col>
                                    <Text>
                                        {t('Drag or Click to Upload Media')}
                                    </Text>
                                </Col>
                                <Col span={10}>
                                    <Divider
                                        style={{
                                            margin: 0,
                                            color: 'rgba(0, 0, 0, 0.25)',
                                        }}
                                    >
                                        {t('Or')}
                                    </Divider>
                                </Col>
                                <Col>
                                    <Button type="primary">
                                        {t('Upload File')}
                                    </Button>
                                </Col>
                            </Row>
                        </>
                    )}
                </Dragger>
            </DraggerSrc>
        </UploadStc>
    );
};

export default Upload;
