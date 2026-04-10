import { ElementContext } from 'contexts/ElementRenderContext';
import { useContext } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

const OverlayStc = styled.div`
    inset: 0;
    position: fixed;
    background-color: transparent;
`;

const allowedOverlayKeys = ['MORE-MENU', 'VERSION-HISTORY', 'PUBLISH-SETTINGS'];

export const Overlay = ({ mask = false }) => {
    const { showSettingsModal, activeSidebar } = useContext(ElementContext);
    const showOverlay = mask || allowedOverlayKeys.includes(activeSidebar);

    return showOverlay
        ? createPortal(
              <OverlayStc onClick={() => showSettingsModal('')} />,
              document.body
          )
        : null;
};
