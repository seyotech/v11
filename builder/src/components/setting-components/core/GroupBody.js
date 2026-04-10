/*****************************************************
 * Packages
 ******************************************************/
import React, { useState, useContext, useCallback } from 'react';
import styled from 'styled-components';

/*****************************************************
 * Locals
 ******************************************************/
import {
    ElementContext,
    EditorContext,
} from '../../../contexts/ElementRenderContext';
import Tab, { TabOption } from '../reusable/Tab';
import RenderTemplate from './RenderTemplate';

/*****************************************************
 * Styles
 ******************************************************/
// const tabStyle = { fontSize: '14px', marginTop: '5px' };

const Info = styled.p``;
const GroupContent = styled.div`
    margin-top: 8px;
    margin-bottom: 16px;
    &:last-child {
        margin-bottom: 0;
    }
`;

const GroupBody = ({ group, handleChange, isSidebar }) => {
    const [activeHover, setHover] = useState(false);
    const [lastDevice, setLastDevice] = useState('desktop');
    const { handleResponsiveEditorMode } = useContext(ElementContext);
    const { display, currentEditItem } = useContext(EditorContext);
    const tabStyle = {
        fontSize: isSidebar ? '12px' : '14px',
        marginTop: '5px',
    };
    const handleSetHover = useCallback(
        (payload) => {
            if (payload.value) {
                setLastDevice(display);
                handleResponsiveEditorMode('desktop');
            } else {
                handleResponsiveEditorMode(lastDevice);
            }
            setHover(payload.value);
        },
        [display, handleResponsiveEditorMode, lastDevice]
    );

    return (
        <>
            {group.hoverControl !== false && (
                <>
                    <Tab
                        height="24px"
                        style={tabStyle}
                        type="underlined"
                        selected={activeHover}
                        onSelect={handleSetHover}
                    >
                        <TabOption value={false}>NORMAL</TabOption>
                        <TabOption value={true}>HOVER</TabOption>
                    </Tab>
                    {activeHover && (
                        <Info>* You are seeing only hover supported items</Info>
                    )}
                </>
            )}

            <GroupContent>
                <RenderTemplate
                    module={group}
                    display={display}
                    data={currentEditItem}
                    activeHover={activeHover}
                    handleChange={handleChange}
                />
            </GroupContent>
        </>
    );
};

export default React.memo(GroupBody);
