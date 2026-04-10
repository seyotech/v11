import { useCallback, useContext, useRef, useState } from 'react';

import { BuilderContext } from 'contexts/BuilderContext';
import { Dropdown } from 'modules/Shared/Dropdown';
import { ElementContext } from '../../../contexts/ElementRenderContext';
import useImport from '../../../hooks/useImport';
import { getMoreMenuOptions } from '../utils/menu';
import { ImportModal } from './ImportModal';

export const MoreMenu = ({ children }) => {
    const [open, setOpen] = useState(false);
    const {
        dispatch,
        preparePages,
        handleExportJSON,
        handleExportFiles,
        isExportFilesAllowed,
        isExportJsonAllowed,
    } = useImport();
    const { onClickContextMenu } = useContext(ElementContext);

    const importRef = useRef();
    const { isWhiteLabelEnabled, user } = useContext(BuilderContext);
    const isAdmin = ['sys_admin', 'sys_reviewer'].includes(user?.role);
    const handleClickImportJSON = useCallback(() => {
        importRef.current.value = '';
        importRef.current.click();
    }, []);

    const handleAISections = () => {
        onClickContextMenu('AI_SECTIONS');
    };

    const handleImportJSON = (e) => {
        const [file] = e.target.files;
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            const data = JSON.parse(reader.result);
            if (data) {
                const { pages, globalStyle, global = globalStyle } = data;
                const json = preparePages({ pages, global });
                dispatch({ type: 'JSON', payload: json });
                setOpen(true);
            }
        };
    };

    const options = getMoreMenuOptions({
        isExportJsonAllowed,
        isExportFilesAllowed,
        handleExportFiles,
        handleAISections,
        handleClickImportJSON,
        isWhiteLabelEnabled,
        isAISectionAllowed: isAdmin,
        handleExportJSON,
    });

    return (
        <>
            <Dropdown
                width="auto"
                arrow={true}
                options={options}
                placement="bottomLeft"
            >
                {children}
            </Dropdown>
            <input
                type="file"
                ref={importRef}
                accept="application/json"
                style={{ display: 'none' }}
                onChange={handleImportJSON}
            />
            <ImportModal open={open} closeModal={() => setOpen(false)} />
        </>
    );
};
