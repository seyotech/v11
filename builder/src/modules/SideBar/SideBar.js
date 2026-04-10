import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Layout, Menu, ConfigProvider } from 'antd';
import { ComponentRenderContext } from '@dorik/html-parser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

import { language } from './utils/languageOptions';
import { HamBurger, SidebarRow } from './SideBar.stc';
import { BuilderContext } from 'contexts/BuilderContext';
import { ElementContext } from 'contexts/ElementRenderContext';
import { AIFeedbackForm } from 'modules/Component/components';

const cmsRoutes = ['/posts', '/members', '/collection', '/settings'];

const SideBar = ({ renderLogo }) => {
    const {
        versionHistory,
        isAIGenerated,
        setBuilderFocus,
        isWhiteLabelEnabled,
    } = useContext(BuilderContext) || {};
    const { drawer, handleDrawer, showSettingsModal, activeSidebar, page } =
        useContext(ElementContext) || {};
    const { t } = useTranslation('builder');

    const isSubscriptionBAnnerpage = page?.ref === 'SUBSCRIPTION_BANNER';

    const {
        i18n,
        navigate,
        selectedKey,
        isCMSDashboard,
        footerMenuItems,
        sidebarMenuItems,
    } = useContext(ComponentRenderContext);

    const settingsMenuItems = [
        'SITE-SETTINGS',
        'GLOBAL-SETTINGS',
        'MORE-MENU',
        'SHORTCUT-LIST',
    ];

    const handleSettingsModal = (e, type) => {
        if (versionHistory.isConfirmationModalOpen) return;
        setBuilderFocus(true);

        if (activeSidebar === type) {
            e.stopPropagation();
            showSettingsModal('');
        } else {
            e.stopPropagation();
            showSettingsModal(type);
        }
    };

    const handleToggleDrawer = ({ key, domEvent }) => {
        if (isCMSDashboard) return;

        if (settingsMenuItems.includes(key)) {
            handleSettingsModal(domEvent, key);
        } else {
            const isOpen = !drawer.isOpen || key !== drawer.drawerName;
            handleDrawer({
                drawerName: key,
                isOpen,
            });
        }
    };
    const topSideBar = [
        {
            key: 'elements',
            disabled: isSubscriptionBAnnerpage,
            label: t('Add Elements'),
            ...icon({ name: 'add', style: 'regular' }),
        },
        {
            key: 'components',
            disabled: isSubscriptionBAnnerpage,
            label: t('Components'),
            ...icon({ name: 'objects-column', style: 'regular' }),
        },
        {
            key: 'pages',
            label: t('Pages'),
            ...icon({ name: 'page', style: 'regular' }),
        },
        {
            key: 'GLOBAL-SETTINGS',
            label: t('Global Styles'),
            className: '_jr-global-styles',
            ...icon({ name: 'pen-paintbrush', style: 'regular' }),
        },
        {
            key: 'navigation',
            disabled: isSubscriptionBAnnerpage,
            label: t('Navigator'),
            ...icon({ name: 'folder-tree', style: 'regular' }),
        },
        {
            key: 'mediaLibrary',
            disabled: isSubscriptionBAnnerpage,
            label: t('Media Library'),
            ...icon({ name: 'image', style: 'regular' }),
        },
        {
            key: 'SITE-SETTINGS',
            label: t('Site Settings'),
            ...icon({ name: 'gear', style: 'regular' }),
        },
    ];
    if (isAIGenerated) {
        topSideBar.push({
            key: 'aiQuickSuggestion',
            label: t('AI Quick Style'),
            ...icon({ name: 'sparkles', style: 'regular' }),
        });
    }

    const getTopSideBarSelectedKeys = () => {
        if (settingsMenuItems.includes(activeSidebar)) {
            return [activeSidebar];
        }
        if (cmsRoutes.includes(selectedKey)) {
            return [selectedKey];
        }
        return [drawer?.drawerName];
    };

    const topBarSelectedKeys = getTopSideBarSelectedKeys();

    const bottomSideBar = [
        // {
        //     key: 'search',
        //     label: 'Search',
        //     ...icon({ name: 'search', style: 'regular' }),
        // },
        // {
        //     key: 'info',
        //     label: 'Info',
        //     ...icon({ name: 'circle-info', style: 'regular' }),
        // },
        // {
        //     key: 'video',
        //     label: 'Video',
        //     ...icon({ name: 'video', style: 'regular' }),
        // },
        // {
        //     key: 'language',
        //     label: 'Language',
        //     children: language.list,
        //     ...icon({ name: 'language', style: 'regular' }),
        // },

        ...(isWhiteLabelEnabled
            ? []
            : [
                  {
                      key: 'documentation',
                      label: t('Documentation'),
                      ...icon({ name: 'book', style: 'regular' }),
                  },
              ]),
        {
            key: 'back',
            label: t('Back To Dashboard'),
            ...icon({ name: 'arrow-up-left-from-circle', style: 'regular' }),
        },
    ];

    if (!isCMSDashboard) {
        bottomSideBar.unshift({
            key: 'SHORTCUT-LIST',
            label: t('Keyboard Shortcuts'),
            ...icon({ name: 'command', style: 'regular' }),
        });
    }

    const itemsGenerator = (items) => {
        return items.map(
            ({ key, label, className, children, disabled, ...rest }) => ({
                key,
                label,
                children,
                disabled: !!disabled,
                className,
                theme: 'light',
                popupOffset: [6],
                icon: (
                    <FontAwesomeIcon size="xl" icon={rest} data-testid={key} />
                ),
            })
        );
    };

    const handleNavigation = ({ key, keyPath = [key] }) => {
        const [menuKey, lang] = keyPath.slice().reverse();

        switch (menuKey) {
            case 'documentation':
                return window.open('https://help.dorik.io', '_blank');
            case 'back':
                return navigate('/');
            case 'language':
                return language.setCurrent(lang, i18n);
            case 'SHORTCUT-LIST':
                return showSettingsModal('SHORTCUT-LIST');
            default:
                break;
        }
    };

    let bottomItems = itemsGenerator(bottomSideBar);
    if (footerMenuItems) {
        bottomItems = [...bottomItems.slice(0, -1)].concat(footerMenuItems);
    }

    let sidebarItems = itemsGenerator(topSideBar);
    if (sidebarMenuItems) {
        sidebarItems = isCMSDashboard
            ? sidebarMenuItems
            : sidebarItems.concat(sidebarMenuItems.slice(1));
    }

    return (
        <>
            <HamBurger type="text" icon={renderLogo()} />
            <Layout.Sider
                trigger={null}
                collapsed={true}
                collapsedWidth={50}
                style={{
                    zIndex: 101,
                    height: '100vh',
                    background: '#001529',
                }}
            >
                <SidebarRow>
                    <Col style={{ marginTop: 40 }}>
                        <Menu
                            theme="dark"
                            items={sidebarItems}
                            className="top-menu menus"
                            onClick={handleToggleDrawer}
                            selectedKeys={topBarSelectedKeys}
                            defaultSelectedKeys={['addElements']}
                        />
                    </Col>
                    {isAIGenerated && <AIFeedbackForm />}

                    <Col className="bottom-sidebar">
                        <ConfigProvider
                            theme={{
                                components: {
                                    Menu: {
                                        dropdownWidth: 120,
                                        itemHoverBg: '#F4F6F9',
                                        subMenuItemBorderRadius: 0,
                                    },
                                },
                            }}
                        >
                            <Menu
                                theme="dark"
                                mode="vertical"
                                className="menus"
                                items={bottomItems}
                                onClick={handleNavigation}
                                selectedKeys={[language.getCurrent()]}
                            />
                        </ConfigProvider>
                    </Col>
                </SidebarRow>
            </Layout.Sider>
        </>
    );
};

export default SideBar;
