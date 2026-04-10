import { Col, Modal, Row, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createGlobalStyle } from 'styled-components';
import UploadTabs from './UploadTabs';
export const ModalGlobalStc = createGlobalStyle`
    .custom-modal .ant-modal-mask,
    .custom-modal .ant-modal-wrap{
       z-index: 1000 !important;
    }
   
`;

const { Text } = Typography;

const FileUploadModal = ({ open, setOpen, ...rest }) => {
    const [state, setState] = useState({ ...rest, activeKey: '1' });

    useEffect(() => {
        const activeKey = typeof open === 'string' ? open : '1';
        setState((prev) => ({ ...prev, activeKey }));
    }, [open]);
    const { t } = useTranslation('builder');

    return (
        <>
            <Modal
                centered
                open={!!open}
                footer={null}
                width={1024}
                rootClassName="custom-modal"
                onCancel={() => setOpen(false)}
            >
                <Row gutter={[8, 8]}>
                    <Col span={24}>
                        <Text
                            style={{ fontSize: 20, lineHeight: '28px' }}
                            strong
                        >
                            {t('Insert Media')}
                        </Text>
                    </Col>
                    <Col span={24}>
                        <Text style={{ color: '#45426E' }}>
                            {t(
                                'Manage all your media including image, icon, font and videos'
                            )}
                        </Text>
                    </Col>
                    <Col span={24} />
                    <Col span={24}>
                        <UploadTabs {...state} setState={setState} />
                    </Col>
                </Row>
            </Modal>
            <ModalGlobalStc />
        </>
    );
};

export default FileUploadModal;
