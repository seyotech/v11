/*****************************************************
 * Packages
 ******************************************************/
import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import styled from 'styled-components';

import { Button } from 'antd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

/*****************************************************
 * Locals
 ******************************************************/

import { useTranslation } from 'react-i18next';
import { BuilderContext } from '../../../contexts/BuilderContext';
import { EditorContext } from '../../../contexts/ElementRenderContext';
import { getHelpLink } from '../../../getHelpLink';
import Accordion from '../SettingAccordion';
import SettingModalTab from '../SettingModalTab';
import EditorModalBase from './EditorModalBase';

const ModalFooter = styled.div`
    left: 0;
    right: 0;
    bottom: 0;
    font-size: 14px;
    position: absolute;
    color: ${({ theme }) => theme.bodyText};
    display: flex;
    height: 40px;
    padding: 0 20px;
    align-items: center;
    justify-content: space-between;
    border-radius: 0 0 5px 5px;
    background: ${({ theme }) => theme.primary.bg};
    border-top: 2px solid ${({ theme }) => theme.inputBorder};

    a {
        color: ${({ theme }) => theme.bodyText};
        &:hover {
            color: ${({ theme }) => theme.primary.fg};
        }
    }

    .undo-redo {
        padding-left: 8px;
        padding-right: 8px;
    }

    .icon {
        color: ${({ theme }) => theme.primary.fg};
    }
`;

const EditorModal = (props) => {
    const [modalScale, setModalScale] = useState(1);
    const simpleBarRef = useRef();
    const { close, title, settings, editElType, onSaveSettings, isRenameable } =
        props;
    const { t } = useTranslation('builder');

    const [activeTab, setActiveTab] = useState(0);
    const [animatClass, setAnimatClass] = useState('');
    const settingsContent = useMemo(
        () => settings[activeTab].getContentByType(editElType),
        [activeTab, editElType, settings]
    );
    const { isWhiteLabelEnabled, isBuilderFocus } = useContext(BuilderContext);

    const { editAddress, activeSidebar } = useContext(EditorContext);

    const handleModalClose = useCallback(() => {
        settingsContent
            .filter((group) => group.actions)
            .map((group) => {
                const { onModalClose } = group.actions;
                return onModalClose?.({ updateSettings: onSaveSettings });
            });

        close();
    }, [close, onSaveSettings, settingsContent]);

    const resizeModal = (inc) => {
        const nextScale = Number(Number(modalScale).toFixed(2)) + inc;
        if (inc > 0 && nextScale > 1) return;
        if (inc < 0 && nextScale < 0.75) return;
        setModalScale(nextScale);
        localStorage.setItem('__dorik_editor_modal_scale', nextScale);
    };

    useEffect(() => {
        const scale = localStorage.getItem('__dorik_editor_modal_scale');
        setModalScale(scale || 1);
    }, []);

    useEffect(() => {
        setAnimatClass('animated');
    }, [editAddress]);

    useEffect(() => {
        if (!isBuilderFocus) {
            handleModalClose();
        }
    }, [isBuilderFocus]);

    let helpLink = getHelpLink({
        isWhiteLabelEnabled,
        content: 'root',
    });

    return (
        <EditorModalBase
            style={{
                transition: 'transform 250ms',
                transform: `scale(${modalScale})`,
            }}
            hasBackdrop={false}
            close={handleModalClose}
            title={title}
            size="sm"
            modalScale={modalScale}
            animatClass={animatClass}
            onAnimationEnd={() => setAnimatClass('')}
            activeSidebar={activeSidebar}
            isRenameable={isRenameable}
        >
            <SettingModalTab
                settings={settings}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            <SimpleBar ref={simpleBarRef} style={{ maxHeight: 513 }}>
                <Accordion
                    simpleBarRef={simpleBarRef}
                    settingsContent={settingsContent}
                    onSaveSettings={onSaveSettings}
                />
            </SimpleBar>
            <ModalFooter>
                <a target="_blank" rel="noopener noreferrer" href={helpLink}>
                    {t('Read Documentation')}
                </a>
                <div>
                    <Button
                        size="sm"
                        type="link"
                        style={{ fontSize: '16px' }}
                        onClick={() => resizeModal(-0.05)}
                    >
                        -
                    </Button>
                    {t('Resize')}
                    <Button
                        size="sm"
                        type="link"
                        style={{ fontSize: '16px' }}
                        onClick={() => resizeModal(0.05)}
                    >
                        +
                    </Button>
                </div>
            </ModalFooter>
        </EditorModalBase>
    );
};

const EditorModalDragable = (props) => {
    return (
        <DndProvider backend={HTML5Backend}>
                <EditorModal {...props} />
        </DndProvider>
    );
};

export default React.memo(EditorModalDragable);
