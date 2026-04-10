import { ImportContext } from 'contexts/ImportContext';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

const useImport = () => {
    const context = useContext(ImportContext);
    const { t } = useTranslation('builder');
    if (!context) {
        throw new Error(t('useImport should be called inside ImportProvider'));
    }

    const {
        state,
        dispatch,
        oldPages,
        preparePages,
        handleExportJSON,
        handleExportFiles,
        isExportFilesAllowed,
    } = context;
    const setIds = (payload) => dispatch({ type: 'ADD_LIST', payload });
    const clearIds = () => dispatch({ type: 'CLEAR_LIST' });
    const setImport = (payload) => dispatch({ type: 'IMPORT', payload });

    return {
        state,
        setIds,
        dispatch,
        clearIds,
        oldPages,
        setImport,
        preparePages,
        handleExportJSON,
        handleExportFiles,
        isExportFilesAllowed,
    };
};

export default useImport;
