import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import i18next from 'i18next';
import deepCopy from 'util/deepCopy';
import { getDnDConfig } from 'util/dndHelpers';
import showNotification from 'util/media/showNotification';

const { t } = i18next;

const generateElementData = ({ element, src, modal }) => {
    const { _elType, type } = element;

    const newItem = deepCopy(element);
    if (type === 'image') {
        newItem.attr = {
            ...newItem?.attr,
            src,
        };
    } else if (type === 'video') {
        newItem.sources = {
            ...newItem?.sources,
            mp4: src,
        };
    } else {
        throw new Error(t(`({{type}}) invalid element type`, { type }));
    }

    const dndConfig = getDnDConfig(type);
    return {
        elType: _elType,
        data: newItem,
        addElType: _elType,
        type: dndConfig.type,
    };
};

const style = {
    height: '32px',
    fontSize: '14px',
    lineHeight: '22px',
    padding: '5px 12px',
};

export const getDropdownOptions = ({
    data,
    setOpen,
    getFileURL,
    handleDeleteMedia,
    modal,
}) => {
    const handleDelete = () => {
        modal.confirm({
            content: t(`Are you sure you want to remove this {{data}}?`, {
                data: data.kind,
            }),
            okText: t('Yes'),
            cancelText: t('No'),
            onOk: async () => {
                await handleDeleteMedia({ id: data.id, kind: data.kind });
            },
        });
    };

    const options = [
        {
            style,
            key: `rename-${data.id}`,
            label: t('Rename'),
            icon: icon({ name: 'gear', style: 'regular' }),
            onClick: () => setOpen(true),
            tooltip: t('Rename This File'),
        },
        {
            style,
            key: `copy-${data.id}`,
            label: t('Copy Link'),
            icon: icon({ name: 'link' }),
            onClick() {
                navigator.clipboard.writeText(getFileURL(data.path));
                showNotification({
                    type: 'success',
                    message: t('File URL copied to clipboard'),
                });
            },
        },
        {
            key: 'divider',
            type: 'divider',
        },
        {
            style,
            danger: true,
            key: `delete-${data.id}`,
            label: t('Delete'),
            onClick: handleDelete,
            icon: icon({ name: 'trash' }),
            // tooltip: t('Delete This File'),
        },
    ];

    return options;
};

export default generateElementData;
