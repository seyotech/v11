export const fieldTypesEnum = {
    DATE: 'DATE',
    TEXT: 'TEXT',
    LINK: 'LINK',
    LIST: 'LIST',
    IMAGE: 'IMAGE',
    EMAIL: 'EMAIL',
    NUMBER: 'NUMBER',
    RICH_TEXT: 'RICH_TEXT',
    MULTI_SELECT: 'MULTI_SELECT',
    SINGLE_SELECT: 'SINGLE_SELECT',
    MULTI_REFERENCE: 'MULTI_REFERENCE',
    SINGLE_REFERENCE: 'SINGLE_REFERENCE',

    // generate exclude type
    EXCLUDE_DATE: '!DATE',
    EXCLUDE_TEXT: '!TEXT',
    EXCLUDE_LINK: '!LINK',
    EXCLUDE_LIST: '!LIST',
    EXCLUDE_IMAGE: '!IMAGE',
    EXCLUDE_EMAIL: '!EMAIL',
    EXCLUDE_NUMBER: '!NUMBER',
    EXCLUDE_RICH_TEXT: '!RICH_TEXT',
    EXCLUDE_MULTI_SELECT: '!MULTI_SELECT',
    EXCLUDE_SINGLE_SELECT: '!SINGLE_SELECT',
    EXCLUDE_SINGLE_REFERENCE: '!SINGLE_REFERENCE',
};

export const IMAGE = [fieldTypesEnum.IMAGE];
export const TEXT = [fieldTypesEnum.TEXT];
export const LIST = [fieldTypesEnum.LIST];
export const RICH_TEXT = [fieldTypesEnum.RICH_TEXT];
export const TEXT_AND_RICH_TEXT = [
    fieldTypesEnum.EXCLUDE_IMAGE,
    fieldTypesEnum.EXCLUDE_LIST,
];
export const TEXT_WITHOUT_RICH_TEXT = [
    fieldTypesEnum.EXCLUDE_IMAGE,
    fieldTypesEnum.EXCLUDE_LIST,
    fieldTypesEnum.EXCLUDE_RICH_TEXT,
];
export const TEXT_WITHOUT_IMAGE = [
    fieldTypesEnum.EXCLUDE_IMAGE,
    fieldTypesEnum.EXCLUDE_LIST,
];
