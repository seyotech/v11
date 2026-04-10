import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AsideExpend from './AsideExpend';
import { Aside, AsideMain } from './BuilderAside.sc';
import Pages from './Pages';
import NavigationTree from './components/NavigationTree';
import Tooltip from './components/Tooltip';
import { NAVIGATION_TREE } from './constants';
import { BuilderContext } from './contexts/BuilderContext';
import useClickOutside from './hooks/useClickOutside';

function BuilderAside({
    activeSidebar,
    showSettingsModal,
    toggleActiveSidebar,
    editPage,
    ...restOfProps
}) {
    const { versionHistory, setBuilderFocus } = useContext(BuilderContext);
    const { isConfirmationModalOpen } = versionHistory;
    const expendRef = useRef();
    const [navTreeExpandedKeys, setNavTreeExpandKeys] = useState([]);
    const getActiveClassName = useCallback(
        (type) => (activeSidebar === type ? 'active' : ''),
        [activeSidebar]
    );
    const { t } = useTranslation('builder');

    const handleClose = useCallback(() => {
        if (expendRef?.current) expendRef.current.style.left = null;
        setTimeout(() => {
            toggleActiveSidebar('');
        }, 350);
    }, [toggleActiveSidebar]);

    const asideRef = useClickOutside(() => {
        if (activeSidebar === NAVIGATION_TREE) return;
        handleClose();
    });

    useEffect(() => {
        if (expendRef?.current) {
            if (activeSidebar) {
                expendRef.current.style.left = '50px';
            }
        }
    }, [activeSidebar, toggleActiveSidebar]);

    const handleToggleSideBar = (event) => {
        event.stopPropagation();
        toggleActiveSidebar('PAGES');
    };

    const handleModal = (event, type) => {
        if (activeSidebar === type) {
            event.stopPropagation();
            showSettingsModal();
        } else {
            event.stopPropagation();
            showSettingsModal(type);
        }
    };

    const isVersionHistoryModalOpen = (e, cb, type) => {
        if (isConfirmationModalOpen) return;
        setBuilderFocus(true);
        cb(e, type);
    };

    return (
        <Aside>
            <AsideMain>
                <Tooltip
                    effect="hover"
                    content={t('Pages')}
                    placement="right"
                    id="builder-aside-page"
                    className={getActiveClassName('PAGES')}
                    onClick={(e) =>
                        isVersionHistoryModalOpen(
                            e,
                            handleToggleSideBar,
                            'PAGES'
                        )
                    }
                >
                    <FontAwesomeIcon icon={['far', 'file']} />
                </Tooltip>
                <Tooltip
                    effect="hover"
                    placement="right"
                    content={t('Global Styles')}
                    id="builder-aside-global-setting"
                    className={getActiveClassName('GLOBAL-SETTINGS')}
                    onClick={(e) =>
                        isVersionHistoryModalOpen(
                            e,
                            handleModal,
                            'GLOBAL-SETTINGS'
                        )
                    }
                >
                    <FontAwesomeIcon icon={['far', 'pencil-paintbrush']} />
                </Tooltip>
                <Tooltip
                    effect="hover"
                    placement="right"
                    content={t('Site Settings')}
                    id="builder-aside-site-setting"
                    className={getActiveClassName('SITE-SETTINGS')}
                    onClick={(e) =>
                        isVersionHistoryModalOpen(
                            e,
                            handleModal,
                            'SITE-SETTINGS'
                        )
                    }
                >
                    <FontAwesomeIcon icon={['far', 'cogs']} />
                </Tooltip>
                {editPage.ref !== 'SUBSCRIPTION_BANNER' && (
                    <Tooltip
                        effect="hover"
                        placement="right"
                        content={t('Navigation Tree')}
                        id="builder-aside-tree-navigation"
                        className={getActiveClassName(NAVIGATION_TREE)}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleActiveSidebar(NAVIGATION_TREE);
                        }}
                    >
                        <FontAwesomeIcon icon="fa-regular fa-folder-tree" />
                    </Tooltip>
                )}
            </AsideMain>
            {[NAVIGATION_TREE, 'PAGES'].includes(activeSidebar) && (
                <div ref={asideRef}>
                    <AsideExpend
                        ref={expendRef}
                        close={handleClose}
                        title={activeSidebar?.split('_').join(' ')}
                    >
                        {activeSidebar === 'PAGES' && (
                            <Pages {...restOfProps} />
                        )}
                        {activeSidebar === 'NAVIGATION_TREE' && (
                            <NavigationTree
                                navTreeExpandedKeys={navTreeExpandedKeys}
                                setNavTreeExpandKeys={setNavTreeExpandKeys}
                                {...restOfProps}
                            />
                        )}
                    </AsideExpend>
                </div>
            )}
        </Aside>
    );
}

export default BuilderAside;
