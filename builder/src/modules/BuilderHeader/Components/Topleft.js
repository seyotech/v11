import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Divider, Space, Tooltip, Typography } from 'antd';
import { useContext, useState } from 'react';
import CollectionDropdown from '../../../components/CollectionDropdown/index';
import { ElementContext } from '../../../contexts/ElementRenderContext';
import { BuilderContext } from '../../../contexts/BuilderContext';
import useClickOutside from 'hooks/useClickOutside';

/**
 * Represents a component that receives props from BuilderHeader.
 *
 * @component
 *
 * @typedef {Object} builderProps
 * @property {Boolean} authUser - Indicates whether the user is authenticated or not.
 *
 * @param {Object} props - The props for this component.
 * @param {builderProps} props.builderProps - Props passed from Builder.js.
 * @param {function} props.t - translation function
 * @returns {JSX.Element} A JSX element representing this component.
 */

function Topleft({ builderProps, t }) {
    const { versionHistory, setBuilderFocus } =
        useContext(BuilderContext);
    const {
        currentPageInfo,
        showSettingsModal,
        setTemplateInfo,
        activeSidebar,
        settingsModal,
        drawer: { drawerName },
        editAddress,
    } = useContext(ElementContext);
    const [isVersionHistoryActive, setIsVersionHistoryActive] = useState(false);
    const ref = useClickOutside(() => setIsVersionHistoryActive(false));

    const { authUser } = builderProps;

    [settingsModal, activeSidebar].some(
        (key) => key && key !== 'COMPONENT_SETTINGS'
    ) &&
        isVersionHistoryActive &&
        setIsVersionHistoryActive(false);

    const toggleModal = (key, triggerFrom = '') => {
        if (versionHistory.isConfirmationModalOpen) return;

        setBuilderFocus(true);
        showSettingsModal(
            activeSidebar === key ? '' : key,
            triggerFrom === 'VERSION-HISTORY' ? editAddress : null,
            triggerFrom
        );
    };
    const toggleVersionHistory = ({ visible, closeAll = false }) => {
        if (closeAll) {
            toggleModal('');
            setIsVersionHistoryActive(false);
            return;
        }
        setIsVersionHistoryActive(visible);
        if (visible) {
            (![settingsModal, activeSidebar].includes('COMPONENT_SETTINGS') ||
                drawerName === 'navigation') &&
                toggleModal('', `VERSION-HISTORY`);
        }
    };

    const getType = (key) => (activeSidebar === key ? 'primary' : 'text');

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
        >
            <Tooltip title={currentPageInfo.name}>
                <Typography.Text
                    style={{
                        maxWidth: '100px',
                        verticalAlign: 'middle',
                    }}
                    ellipsis
                >
                    {currentPageInfo.name}
                </Typography.Text>
            </Tooltip>
            <Tooltip title={t('Page Settings')}>
                <Button
                    data-testid="pageSettingsButton"
                    size="small"
                    className="_jr-page-settings"
                    onClick={() => toggleModal('PAGE-SETTINGS')}
                    disabled={currentPageInfo.ref === 'SUBSCRIPTION_BANNER'}
                    type={getType('PAGE-SETTINGS')}
                    icon={
                        <FontAwesomeIcon
                            icon={icon({
                                name: 'wrench',
                                style: 'regular',
                            })}
                            data-testid="pageSettingsIcon"
                        />
                    }
                />
            </Tooltip>
            {currentPageInfo.pageType === 'TEMPLATE' && (
                <CollectionDropdown
                    {...builderProps}
                    onSaveSettings={setTemplateInfo}
                    t={t}
                />
            )}
            {''}
        </Space>
    );
}

export default Topleft;
