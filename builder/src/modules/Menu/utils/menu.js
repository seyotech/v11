import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import i18next from 'i18next';
import { nanoid } from 'nanoid';
import { maxPageNumber } from '../../../util/maxPageNumber';

const { t } = i18next;

export const handleDuplicatePage = (page, pages, oldPages) => {
    const uuid = nanoid(6);

    page.slug = `${page.slug}-${uuid}`;
    page.name = `${page.name} ${maxPageNumber({
        pages,
        oldPages,
        name: page.name,
    })}`;
};

export const handleDuplicateHome = (page, pages, oldPages) => {
    page.slug = `index-${nanoid(6)}`;
    page.type = null;
    page.pageType = 'REGULAR';
    page.name = t(`Home Old {{maxPageNumber}}`, {
        maxPageNumber: maxPageNumber({
            pages,
            oldPages,
        }),
    });
};

const style = {
    height: '32px',
    fontSize: '13px',
    lineHeight: '20px',
    padding: '5px 12px',
};

export const getMoreMenuOptions = ({
    handleExportJSON,
    isAISectionAllowed,
    handleAISections,
    isExportFilesAllowed,
    isExportJsonAllowed,
    handleExportFiles,
    handleClickImportJSON,
}) => {
    const options = [
        {
            style,
            key: 'import-json',
            label: t('Import JSON'),
            icon: regular('file-import'),
            onClick: handleClickImportJSON,
        },
    ];

    if (isAISectionAllowed) {
        options.splice(0, 0, {
            style,
            key: 'aiSections',
            label: t('AI Sections'),
            icon: regular('sparkles'),
            disabled: !isAISectionAllowed,
            onClick: handleAISections,
        });
    }
    if (isExportFilesAllowed) {
        options.splice(1, 0, {
            style,
            key: 'export',
            label: t('Export Files'),
            icon: regular('file-export'),
            onClick: handleExportFiles,
        });
    }
    if (isExportJsonAllowed) {
        options.push({
            style,
            key: 'export-json',
            label: t('Export as JSON'),
            icon: regular('file-zipper'),
            onClick: handleExportJSON,
        });
    }

    return options;
};
