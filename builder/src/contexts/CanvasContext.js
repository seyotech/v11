import React, { useContext, useMemo } from 'react';

const CanvasContext = React.createContext();

export const CanvasWrapper = (props) => {
    const {
        user,
        global,
        symbols,
        appName,
        children,
        getElement,
        permission,
        addElement,
        pageSettings,
        showAddModal,
        previewMapper,
        onSaveSettings,
        aiLoadingState,
        onClickSettings,
        getDataByAddress,
        currentEditAddress,
        onElementRightClick,
        cleanUpElementEditMode,
        isConfirmationModalOpen,
        getReferenceForNavTreeEl,
        settingsModalTriggerFrom,
    } = props;

    const value = useMemo(() => {
        return {
            user,
            global,
            appName,
            symbols,
            permission,
            getElement,
            addElement,
            pageSettings,
            showAddModal,
            previewMapper,
            onSaveSettings,
            onClickSettings,
            getDataByAddress,
            currentEditAddress,
            onElementRightClick,
            cleanUpElementEditMode,
            getReferenceForNavTreeEl,
            settingsModalTriggerFrom,
            isConfirmationModalOpen,
            loadingState: aiLoadingState,
        };
    }, [
        user,
        global,
        symbols,
        appName,
        permission,
        getElement,
        addElement,
        pageSettings,
        showAddModal,
        previewMapper,
        aiLoadingState,
        onSaveSettings,
        onClickSettings,
        getDataByAddress,
        currentEditAddress,
        onElementRightClick,
        cleanUpElementEditMode,
        getReferenceForNavTreeEl,
        settingsModalTriggerFrom,
        isConfirmationModalOpen,
    ]);

    return (
        <CanvasContext.Provider value={value}>
            {children}
        </CanvasContext.Provider>
    );
};

export const useCanvasContext = () => {
    const context = useContext(CanvasContext);

    if (!context) {
        throw new Error(
            `CanvasContext should be used within CanvasContextProvider`
        );
    }

    return context;
};
