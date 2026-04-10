import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';

import { RENAME_ELEMENT } from '../../constants';
import {
    EditorContext,
    ElementContext,
} from '../../contexts/ElementRenderContext';
import useClickOutside from '../../hooks/useClickOutside';
import useCmsRow from '../../hooks/useCmsRow/index';
import useLocalStorage from '../../hooks/useLocalStorage';
import {
    COMPONENT_SETTINGS,
} from '../../util/constant';
import SaveGlobalModal from '../ElementControls/SaveGlobalModal';
import Portal from '../Portal';
import {
    ItemDivider,
    Menu,
    MenuItem,
    NestedMenu,
    Title,
} from './ElementContextMenu.stc';
import { useTranslation } from 'react-i18next';

const ElementContextMenu = ({ contextMenuVisibile, ...restOfProps }) => {
    const { hideContextMenu } = restOfProps;
    const { getItem } = useLocalStorage();
    const [modal, setModal] = React.useState('');

    const { linkSymbol, cleanUpElementEditMode } = useContext(ElementContext);
    const { currentEditItem: data, elementContext } = useContext(EditorContext);
    const { selectedField } = useCmsRow();

    const hideModal = React.useCallback(() => {
        setModal('');
        cleanUpElementEditMode();
    }, [cleanUpElementEditMode]);

    const showModal = React.useCallback(
        (modal) => {
            hideContextMenu();
            setModal(modal);
        },
        [hideContextMenu]
    );

    const isDisable = (type) => {
        if (data?.cms_column) {
            return true;
        }
        switch (type) {
            case 'pasteStyle':
                return getItem('style')?.type !== data.type;
            case 'clone':
            case 'delete':
                return data?.component_label === 'nestedCol' && !!selectedField;

            case 'symbol':
            case 'saveToCollection':
                return (
                    !!data?.component_label ||
                    !!data?.configuration?.selectedField
                );
        }
    };

    return (
        <>
            {contextMenuVisibile && (
                <MenuPortal
                    {...restOfProps}
                    data={data}
                    showModal={showModal}
                    elementContext={elementContext}
                    isDisable={isDisable}
                />
            )}

            <SaveGlobalModal
                data={data}
                close={hideModal}
                onSave={linkSymbol}
                visible={modal === 'LINK_GLOBAL_ELEMENT'}
            />
        </>
    );
};

export default ElementContextMenu;

function MenuPortal({
    data,
    position,
    showModal,
    isDisable,
    elementContext,
    hideContextMenu,
}) {
    const { getItem, setItem } = useLocalStorage();

    const isSymbol = !!elementContext.symbolId;
    const {
        onClickContextMenu,
        duplicateElement,
        pasteElementStyleByAddress,
        getElementStyleByAddress,
        onRemove,
    } = useContext(ElementContext);
    const { t } = useTranslation('builder');

    const ref = useClickOutside(hideContextMenu);

    React.useEffect(() => {
        if (ref.current) {
            const { clientX, clientY } = position;
            const { offsetHeight, offsetWidth } = ref.current;
            let top = clientY + 60;
            let left = clientX + 60;
            if (window.innerHeight < top + offsetHeight) {
                top = top - offsetHeight;
            }
            if (window.innerWidth < left + offsetWidth) {
                left = left - offsetWidth;
            }
            ref.current.style.zIndex = 99999;
            ref.current.style.top = top + 'px';
            ref.current.style.left = left + 'px';
        }
    }, [position, ref]);

    const handleCopyStyle = () => {
        const style = getElementStyleByAddress();
        setItem('style', style);
    };

    const handlePasteStyle = () => {
        return pasteElementStyleByAddress(getItem('style'));
    };

    return (
        <Portal>
            <Menu ref={ref}>
                <Title>
                    <span title={t(data.name)}>
                        {t(data.name)?.toUpperCase()}
                    </span>
                </Title>
                <MenuItem
                    onClick={() => {
                        onClickContextMenu(COMPONENT_SETTINGS);
                    }}
                >
                    <FontAwesomeIcon icon={['far', 'edit']} />
                    <span>{t('Edit')}</span>
                </MenuItem>
                <MenuItem
                    disable={isDisable('clone')}
                    onClick={
                        isDisable('clone') ? null : () => duplicateElement()
                    }
                >
                    <FontAwesomeIcon icon={['far', 'clone']} />
                    <span>{t('Duplicate')}</span>
                </MenuItem>
                <MenuItem onClick={() => onClickContextMenu(RENAME_ELEMENT)}>
                    <FontAwesomeIcon icon={['fas', 'pen']} />
                    <span>{t('Rename')}</span>
                </MenuItem>
                <MenuItem>
                    <NestedMenu>
                        <MenuItem onClick={handleCopyStyle}>
                            <span>{t('Styles')}</span>
                        </MenuItem>
                    </NestedMenu>
                    <FontAwesomeIcon icon={['far', 'clipboard']} />
                    <span>{t('Copy')}</span>
                </MenuItem>
                <MenuItem>
                    <NestedMenu>
                        <MenuItem
                            disable={isDisable('pasteStyle')}
                            onClick={
                                isDisable('pasteStyle')
                                    ? null
                                    : handlePasteStyle
                            }
                        >
                            <span>{t('Styles')}</span>
                        </MenuItem>
                    </NestedMenu>
                    <FontAwesomeIcon icon={['far', 'paste']} />
                    <span>{t('Paste')}</span>
                </MenuItem>
                <ItemDivider />
                <MenuItem
                    disable={isDisable('delete')}
                    onClick={isDisable('delete') ? null : () => onRemove()}
                >
                    <FontAwesomeIcon icon={['far', 'trash-alt']} color="red" />
                    <span style={{ color: 'red' }}>{t('Delete')}</span>
                </MenuItem>
            </Menu>
        </Portal>
    );
}
