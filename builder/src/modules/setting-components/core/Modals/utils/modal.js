import { t } from 'i18next';
import GlobalSymbol from 'modules/Component/components/GlobalSymbol';
import { SavedElementCollectionWithSearchFilter } from 'modules/Component/components/SavedElementCollection';
import { SectionLibraryCollection } from 'modules/Component/components/SectionLibraryCollection';
import { ElementCollectionWithSearchFilter } from 'modules/Element/components/ElementCollection';
import EmptyColumn from 'modules/Element/components/EmptyColumn';
import EmptyContainer from 'modules/Element/components/EmptyContainer';
import { getType } from 'util/dndHelpers';
import ucFirst from 'util/ucFirst';
import { DND_TYPES } from '../../../../../constants';
const { SECTION, ROW, CONTAINER, CONTAINERS, COLUMN, COMPONENT, CMS_ROW } =
    DND_TYPES;

const generateKey = (label) => label.replace(/[^\w]/g, '-').toLowerCase();

const createColumnBlocks = ({
    typeEnum,
    parentTypeEnum,
    editAddress,
    shouldShowRowTab,
    appName,
}) => {
    if (
        typeEnum === COMPONENT &&
        (parentTypeEnum !== COLUMN || 4 !== editAddress.split('.').length)
    )
        return;

    let label = typeEnum === COLUMN ? t('Column') : t('Columns'),
        nestedEl = parentTypeEnum === COLUMN,
        type = typeEnum.toUpperCase();

    if (nestedEl) {
        label = t('Nested Row Columns');
    }

    if (shouldShowRowTab) {
        const options = [];
        if (appName === 'CMS') {
            label = t('CMS Row with Columns');
            options.push({
                label,
                key: generateKey(label),
                children: (
                    <EmptyColumn
                        type="cmsRow"
                        nestedEl={nestedEl}
                        parentType={parentTypeEnum}
                    />
                ),
            });
        }

        label = t('Row with Columns(Legacy)');
        options.push({
            label,
            key: generateKey(label),
            children: (
                <EmptyColumn
                    type={type}
                    nestedEl={nestedEl}
                    parentType={parentTypeEnum}
                />
            ),
        });
        return options;
    }

    return {
        label,
        key: generateKey(label),
        children: (
            <EmptyColumn
                type={type}
                nestedEl={nestedEl}
                parentType={parentTypeEnum}
            />
        ),
    };
};

const createContainerBlocks = ({ typeEnum, parentTypeEnum }) => {
    if (parentTypeEnum === COLUMN) {
        return null; // Container cannot be placed within the column.
    }

    const isRootContainer =
        typeEnum === CONTAINER && parentTypeEnum === SECTION;

    const type =
        typeEnum === COMPONENT || isRootContainer
            ? 'CONTAINERS'
            : typeEnum.toUpperCase();

    let label =
        typeEnum === CONTAINER && !isRootContainer
            ? t('Container')
            : t('Containers');

    return {
        label,
        key: generateKey(label),
        children: <EmptyContainer type={type} />,
    };
};

const createPreservedElementBlocks = ({ typeEnum, parentTypeEnum }) => {
    const type = typeEnum === COMPONENT ? 'ELEMENT' : typeEnum.toUpperCase();
    const label = t(`Saved {{type}}`, { type: ucFirst(type) });
    const keys = [type];

    if (
        parentTypeEnum === CONTAINER ||
        (typeEnum === 'ELEMENT' && parentTypeEnum !== COLUMN)
    ) {
        if (typeEnum === COMPONENT) {
            const savedContainerLabel = t(`Saved {{CONTAINER}}`, {
                CONTAINER: ucFirst(CONTAINER),
            });
            return [
                {
                    label,
                    key: generateKey(label),
                    children: (
                        <SavedElementCollectionWithSearchFilter keys={keys} />
                    ),
                },
                {
                    label: savedContainerLabel,
                    key: generateKey(savedContainerLabel),
                    children: (
                        <SavedElementCollectionWithSearchFilter
                            keys={[CONTAINER.toUpperCase()]}
                        />
                    ),
                },
            ];
        } else {
            const savedElementLabel = t(`Saved {{ELEMENT}}`, {
                ELEMENT: ucFirst('ELEMENT'),
            });
            return [
                {
                    label,
                    key: generateKey(label),
                    children: (
                        <SavedElementCollectionWithSearchFilter keys={keys} />
                    ),
                },
                {
                    label: savedElementLabel,
                    key: generateKey(savedElementLabel),
                    children: (
                        <SavedElementCollectionWithSearchFilter
                            keys={['ELEMENT']}
                        />
                    ),
                },
            ];
        }
    }

    return {
        label,
        key: generateKey(label),
        children: <SavedElementCollectionWithSearchFilter keys={keys} />,
    };
};

const createSymbolElementBlocks = ({ typeEnum, parentTypeEnum }) => {
    const type = typeEnum === COMPONENT ? 'ELEMENT' : typeEnum.toUpperCase();
    const label = t(`{{type}} Symbols`, { type: ucFirst(type) });

    if (
        parentTypeEnum === CONTAINER ||
        (type === 'ELEMENT' && parentTypeEnum !== COLUMN)
    ) {
        if (type === 'ELEMENT') {
            const containerSymbolLabel = t(`{{CONTAINER}} Symbols`, {
                CONTAINER: ucFirst(CONTAINER),
            });
            return [
                {
                    label,
                    key: generateKey(label),
                    children: <GlobalSymbol type={type} />,
                },
                {
                    label: containerSymbolLabel,
                    key: generateKey(containerSymbolLabel),
                    children: <GlobalSymbol type={CONTAINER.toUpperCase()} />,
                },
            ];
        } else {
            const elementSymbolLabel = t(`{{ELEMENT}} Symbols`, {
                ELEMENT: ucFirst('ELEMENT'),
            });
            return [
                {
                    label,
                    key: generateKey(label),
                    children: <GlobalSymbol type={type} />,
                },
                {
                    label: elementSymbolLabel,
                    key: generateKey(elementSymbolLabel),
                    children: <GlobalSymbol type="ELEMENT" />,
                },
            ];
        }
    }

    return {
        label,
        key: generateKey(label),
        children: <GlobalSymbol type={type} />,
    };
};

export const getTabContentItems = ({
    type,
    parentType,
    editAddress,
    appName,
}) => {
    const typeEnum = getType(type);
    const parentTypeEnum = getType(parentType);
    const items = [];
    const shouldShowRowTab =
        [CMS_ROW, SECTION, CONTAINERS].includes(typeEnum) ||
        (typeEnum === CONTAINER && parentTypeEnum === SECTION);

    // Add components
    if (
        typeEnum === COMPONENT ||
        // nested row
        (typeEnum === ROW && parentTypeEnum === COLUMN)
    ) {
        items.push({
            key: 'elements',
            label: t('Elements'),
            children: <ElementCollectionWithSearchFilter />,
        });
    }

    // Add empty containers
    if (
        [CONTAINER, CONTAINERS, SECTION, COMPONENT, CMS_ROW].includes(typeEnum)
    ) {
        items.push(createContainerBlocks({ typeEnum, parentTypeEnum }));
    }

    // Add section library
    if (typeEnum === SECTION) {
        items.push({
            key: 'section-library',
            label: t('Section Library'),
            children: <SectionLibraryCollection />,
        });
    }

    // Add empty columns
    if ([COLUMN, ROW, COMPONENT].includes(typeEnum) || shouldShowRowTab) {
        const columnBlocks = createColumnBlocks({
            typeEnum,
            parentTypeEnum,
            editAddress,
            appName,
            shouldShowRowTab,
        });
        items.push(
            ...(Array.isArray(columnBlocks) ? columnBlocks : [columnBlocks])
        );
    }

    // Add preserved elements and symbols
    if ([SECTION, COMPONENT, COLUMN, ROW, CONTAINER].includes(typeEnum)) {
        const savedElements = createPreservedElementBlocks({
            typeEnum,
            parentTypeEnum,
        });
        items.push(
            ...(Array.isArray(savedElements) ? savedElements : [savedElements])
        );

        const symbols = createSymbolElementBlocks({ typeEnum, parentTypeEnum });
        items.push(...(Array.isArray(symbols) ? symbols : [symbols]));
    }

    return items.filter(Boolean);
};
