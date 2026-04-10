/*****************************************************
 * Packages
 ******************************************************/
import T from 'prop-types';
import { useContext, useMemo, useState, useEffect } from 'react';

/*****************************************************
 * Locals
 ******************************************************/
import useEditorModal from 'hooks/useEditorModal';
import { ElementContext } from '../../../../../contexts/ElementRenderContext';
import { Accordion } from '../../Accordion/components';
import { MODAL_TYPES } from '../constants';
import { Float } from './Float';
import { ModalHeader } from './ModalHeader';
import { Sidebar } from './Sidebar';
import { INLINE_EDITOR } from '../../../../../constants';

const { FLOAT, SIDEBAR } = MODAL_TYPES;

const SettingModal = ({
    close,
    title,
    settings,
    editElType,
    onSaveSettings,
}) => {
    const { editorLayout, handleEditorLayout, isSidebar } = useEditorModal();
    const [activeTab, setActiveTab] = useState(0);
    const { handleBuilderLayout, editAddress, settingsModalTriggerFrom } =
        useContext(ElementContext);

    const settingsContent = useMemo(
        () => settings[activeTab].getContentByType(editElType),
        [activeTab, editElType, settings]
    );
    const Modal = editorLayout === FLOAT ? Float : Sidebar;

    const handleLayout = (layout) => {
        handleEditorLayout(layout);
        handleBuilderLayout(layout);
    };

    useEffect(() => {
        if (settingsModalTriggerFrom === INLINE_EDITOR) {
            handleLayout(SIDEBAR);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settingsModalTriggerFrom]);

    return (
            <Modal
                width={262}
                title={
                    <ModalHeader
                        title={title}
                        onClose={close}
                        settings={settings}
                        isSidebar={isSidebar}
                        activeTab={activeTab}
                        handleLayout={handleLayout}
                        setActiveTab={setActiveTab}
                    />
                }
            >
                <Accordion
                    key={`${editAddress}${activeTab}`}
                    onSaveSettings={onSaveSettings}
                    settingsContent={settingsContent}
                    sidebar={editorLayout === SIDEBAR}
                />
            </Modal>
    );
};

SettingModal.propTypes = {
    close: T.func.isRequired,
    title: T.oneOfType([T.string, T.object]),
    settings: T.array.isRequired,
    editElType: T.string,
    onSaveSettings: T.func.isRequired,
};

export default SettingModal;
