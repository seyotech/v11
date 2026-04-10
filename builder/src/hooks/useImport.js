import { useContext } from 'react';
import { ImportContext } from '../contexts/ImportContext';

const useImport = () => {
    const context = useContext(ImportContext);
    if (!context) {
        throw new Error('useImport should be called inside ImportProvider');
    }

    const {
        state,
        dispatch,
        oldPages,
        preparePages,
        handleExportJSON,
        handleExportFiles,
        isExportFilesAllowed,
        isExportJsonAllowed,
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
        isExportJsonAllowed,
    };
};

export default useImport;
