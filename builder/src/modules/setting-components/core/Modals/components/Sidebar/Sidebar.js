/*****************************************************
 * Packages
 ******************************************************/
import { Drawer, FloatButton } from 'antd';
import T from 'prop-types';
import { useContext } from 'react';

/*****************************************************
 * Locals
 ******************************************************/
import { EditorContext, ElementContext } from 'contexts/ElementRenderContext';
import useEditorModal from 'hooks/useEditorModal';
import { DrawerWrapper } from '../Modal.stc';
import { CollapsedBtn } from './CollapsedBtn';
import Footer from './Footer';

export const Sidebar = ({ children, title, width }) => {
    const { sidebarVisible } = useContext(EditorContext);
    const { handleSidebarVisible, settingsModalTriggerFrom } =
        useContext(ElementContext);
    let { sidebarPosition = 'right', handleSidebarPosition } = useEditorModal();

    if (settingsModalTriggerFrom === 'NAVIGATION_TREE') {
        sidebarPosition = 'right';
    }

    const handleClick = () => {
        handleSidebarVisible(!sidebarVisible);
    };

    return (
        <DrawerWrapper $sidebarPosition={sidebarPosition}>
            <Drawer
                mask={false}
                width={width}
                title={title}
                footer={false}
                closeIcon={false}
                getContainer={false}
                open={sidebarVisible}
                placement={sidebarPosition}
            >
                <CollapsedBtn
                    collapsed={!sidebarVisible}
                    handleClick={handleClick}
                    sidebarPosition={sidebarPosition}
                />
                {children}
                <Footer
                    sidebarPosition={sidebarPosition}
                    handleSidebarPosition={handleSidebarPosition}
                />
            </Drawer>
            {!sidebarVisible && (
                <FloatButton
                    shape="square"
                    onClick={handleClick}
                    rootClassName="collapse-btn"
                    data-testid="collapsed-btn"
                    icon={
                        <CollapsedBtn
                            collapsed={!sidebarVisible}
                            handleClick={handleClick}
                            sidebarPosition={sidebarPosition}
                        />
                    }
                />
            )}
        </DrawerWrapper>
    );
};

Sidebar.propTypes = {
    title: T.oneOfType([T.string, T.object]),
    width: T.number.isRequired,
    children: T.element.isRequired,
};
