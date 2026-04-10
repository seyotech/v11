import React, { useRef, useCallback, useState, useContext } from 'react';

import CustomModal from './CustomModal';
import useImport from '../../../hooks/useImport';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BuilderContext } from '../../../contexts/BuilderContext';

const MoreMenu = (props) => {
    const { ListItem, importJSON } = props;
    const [visible, setVisible] = useState(false);
    const {
        dispatch,
        preparePages,
        handleExportJSON,
        handleExportFiles,
        isExportFilesAllowed,
    } = useImport();

    const importRef = useRef();
    const { isWhiteLabelEnabled } = useContext(BuilderContext);

    const handleClickImportJSON = useCallback(() => {
        importRef.current.value = '';
        importRef.current.click();
    }, []);

    const handleImportJSON = useCallback((e) => {
        const [file] = e.target.files;
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            const data = JSON.parse(reader.result);
            if (data) {
                const json = preparePages(data); // {pages,global}
                dispatch({ type: 'JSON', payload: json });
                setVisible(true);
            }
        };
    }, []);

    const handleCloseModal = () => setVisible(false);

    return (
        <>
            <ListItem>
                <span
                    onClick={handleExportFiles}
                    disabled={!isExportFilesAllowed}
                >
                    <FontAwesomeIcon fixedWidth icon={['far', 'file-export']} />{' '}
                    Export Files
                </span>
            </ListItem>
            <ListItem>
                <span onClick={handleClickImportJSON}>
                    <FontAwesomeIcon fixedWidth icon={['far', 'file-import']} />{' '}
                    Import JSON
                </span>
                <input
                    type="file"
                    ref={importRef}
                    style={{ display: 'none' }}
                    accept="application/json"
                    onChange={handleImportJSON}
                />
            </ListItem>

            <ListItem>
                <span onClick={handleExportJSON}>
                    <FontAwesomeIcon fixedWidth icon={['far', 'file-export']} />{' '}
                    Export as JSON
                </span>
            </ListItem>
            {!isWhiteLabelEnabled && (
                <ListItem>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://help.dorik.io"
                    >
                        <FontAwesomeIcon fixedWidth icon={['far', 'books']} />{' '}
                        Documentation
                    </a>
                </ListItem>
            )}

            <ListItem>
                <a href="/">
                    <FontAwesomeIcon
                        fixedWidth
                        icon={['far', 'long-arrow-left']}
                    />{' '}
                    Back to Dashboard
                </a>

                <CustomModal
                    // siteId={siteId}
                    visible={visible}
                    importJSON={importJSON}
                    closeModal={handleCloseModal}
                />
            </ListItem>
        </>
    );
};

export default MoreMenu;
