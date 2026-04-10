/*****************************************************
 * Packages
 ******************************************************/
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Flex, Row, Space, Tooltip, Typography } from 'antd';
import copy from 'clipboard-copy';
import T from 'prop-types';
import { useTranslation } from 'react-i18next';

/*****************************************************
 * Locals
 ******************************************************/
import { useContext } from 'react';
import { BuilderContext } from '../../../../../contexts/BuilderContext';
import {
    EditorContext,
    ElementContext,
} from '../../../../../contexts/ElementRenderContext';
import { usePersistedAISection } from '../../../../AISections/usePersistSection';
import { MODAL_TYPES } from '../constants';
import { ModalHeaderStc } from './Modal.stc';
import Tabs from './Tabs';

export const ModalHeader = ({
    title,
    onClose,
    settings,
    activeTab,
    isSidebar,
    handleLayout,
    setActiveTab,
}) => {
    const { t } = useTranslation('builder');

    const { currentEditItem } = useContext(ElementContext);

    const isAISection = currentEditItem?.ai_sectionId;

    const tooltipTitle = isSidebar
        ? t('Move to Editor Modal')
        : t('Move to Sidebar Editor');

    const editorContext = useContext(EditorContext);
    const { user = {}, siteId } = useContext(BuilderContext);
    const { aiSections = {} } = usePersistedAISection(siteId);
    const editAddress = editorContext?.editAddress;
    const {
        _elType,
        id,
        settings: elSettings,
    } = editorContext?.currentEditItem || {};
    const aiSectionId = elSettings?.aiConfig?.id || aiSections[id];

    const isAdmin = ['sys_admin', 'sys_reviewer'].includes(user.role);
    const enabledCopyBtn = !!(_elType === 'SECTION' && isAdmin && aiSectionId);
    const showEditAddress = !!(editAddress && isAdmin);

    return (
        <ModalHeaderStc>
            <Row gutter={[12, 12]} justify="space-between" align="middle">
                <Col span={20} className="handler">
                    <Flex gap="small" align="center" style={{ width: '100%' }}>
                        <Typography.Text
                            ellipsis={{ tooltip: true }}
                            style={{ fontSize: 16 }}
                            strong
                        >
                            {t(title)}
                        </Typography.Text>
                        {showEditAddress && (
                            <span className="edit-address">
                                ({editAddress})
                            </span>
                        )}
                        {enabledCopyBtn && (
                            <Button
                                size="small"
                                onClick={() => copy(aiSectionId)}
                            >
                                {t('Copy AI Id')}
                            </Button>
                        )}
                    </Flex>
                </Col>
                <Col>
                    <Space size={10} style={{ cursor: 'default' }}>
                        <Tooltip placement="top" title={tooltipTitle}>
                            <FontAwesomeIcon
                                data-testid="modal-toggler"
                                className="icon"
                                icon={
                                    isSidebar
                                        ? icon({
                                              type: 'regular',
                                              name: 'window-restore',
                                          })
                                        : icon({
                                              type: 'regular',
                                              name: 'columns',
                                          })
                                }
                                onClick={() =>
                                    handleLayout(
                                        isSidebar
                                            ? MODAL_TYPES.FLOAT
                                            : MODAL_TYPES.SIDEBAR
                                    )
                                }
                            />
                        </Tooltip>
                        <Tooltip
                            placement="top"
                            title={t('Close the settings modal')}
                        >
                            <FontAwesomeIcon
                                className="icon icon-times"
                                icon={icon({
                                    type: 'regular',
                                    name: 'times',
                                })}
                                data-testid="modal-close"
                                onClick={onClose}
                            />
                        </Tooltip>
                    </Space>
                </Col>
                <Col span={24} style={{ padding: 0 }}>
                    <Tabs
                        settings={settings}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                </Col>
            </Row>
        </ModalHeaderStc>
    );
};

Tabs.propTypes = {
    settings: T.array,
    isSidebar: T.bool,
    activeTab: T.number,
    handleLayout: T.func,
    title: T.oneOfType([T.string, T.object]),
    onClose: T.func,
    setActiveTab: T.func.isRequired,
};
