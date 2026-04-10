import { useContext, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import styled, { css } from 'styled-components';
import { HTML5Backend } from 'react-dnd-html5-backend';
import React, { useRef, useState } from 'react';

import CollapseBtn from './CollapsedBtn';
import SidebarFooter from './SidebarFooter';
import ModalHeader from '../Modals/ModalHeader';
import SettingModalTab from '../SettingModalTab';
import SettingAccordion from '../SettingAccordion';
import useEditorModal from '../../../hooks/useEditorModal';
import { BuilderContext } from '../../../contexts/BuilderContext';
import {
    EditorContext,
    ElementContext,
} from '../../../contexts/ElementRenderContext';

function Sidebar(props) {
    const { settings, editElType, onSaveSettings, close, isRenameable } = props;
    const { isBuilderFocus } = useContext(BuilderContext);
    const { handleSidebarVisible } = useContext(ElementContext);
    const { sidebarVisible, editAddress } = useContext(EditorContext);
    const [animatClass, setAnimatClass] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const simpleBarRef = useRef();

    const { sidebarPosition = 'right', handleSidebarPosition } =
        useEditorModal();

    const settingsContent = React.useMemo(
        () => settings[activeTab].getContentByType(editElType),
        [activeTab, editElType, settings]
    );

    const handleClick = () => {
        handleSidebarVisible(!sidebarVisible);
    };
    const handlePosition = () => {
        let value = sidebarPosition === 'left' ? 'right' : 'left';
        handleSidebarPosition(value);
    };

    useEffect(() => {
        setAnimatClass('animated');
    }, [editAddress]);

    useEffect(() => {
        if (!isBuilderFocus) {
            close();
        }
    }, [isBuilderFocus]);

    return (
        <SidebarWrap
            collapsed={!sidebarVisible}
            style={{ [sidebarPosition]: 0 }}
            sidebarPosition={sidebarPosition}
        >
            <CollapseBtn
                collapsed={!sidebarVisible}
                handleClick={handleClick}
                sidebarPosition={sidebarPosition}
            />
            <SidebarBody>
                <ModalHeader
                    size={'sm'}
                    close={handleClick}
                    sidebarPosition={sidebarPosition}
                    className={animatClass}
                    isRenameable={isRenameable}
                    title={props.title}
                    onAnimationEnd={() => setAnimatClass('')}
                />

                <SettingModalTab
                    settings={settings}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
                <Wrapper>
                    <SettingAccordion
                        simpleBarRef={simpleBarRef}
                        onSaveSettings={onSaveSettings}
                        settingsContent={settingsContent}
                    />
                </Wrapper>
            </SidebarBody>

            <SidebarFooter
                handlePosition={handlePosition}
                sidebarPosition={sidebarPosition}
            />
        </SidebarWrap>
    );
}

const setPosition = ({ collapsed, sidebarPosition }) => {
    if (!collapsed && sidebarPosition === 'left') {
        return css`
            margin-left: 0;
        `;
    }

    if (sidebarPosition === 'left' && collapsed) {
        return css`
            margin-left: -300px;
        `;
    } else if (sidebarPosition === 'right' && collapsed) {
        return css`
            margin-right: -300px;
        `;
    }
};

const Wrapper = styled.div`
    position: absolute;
    width: 100%;
    left: 0;
    height: calc(100% - 124px);
    overflow: auto;
`;

const SidebarBody = styled.div`
    height: 100%;
    position: relative;
`;

const SidebarWrap = styled.div`
    background: #f4f6f9;
    position: absolute;
    width: 300px;
    height: 100%;
    transition: all 0.6s ease-in-out;
    top: 1px;
    box-shadow: 0 2px 8px 0 rgb(43 53 86 / 25%),
        0 -2px 8px 0 rgb(43 53 86 / 25%);
    border-top: 1px solid #e5ebf0;
    &.animated {
        animation: sidebarAnimation 1s linear;
    }
    ${setPosition}
`;

const EditorSidebarDragable = (props) => {
    return (
        <DndProvider backend={HTML5Backend}>
                <Sidebar {...props} />
        </DndProvider>
    );
};

export default React.memo(EditorSidebarDragable);
