import { useContext, useMemo } from 'react';
import useCMS from '../../../hooks/useCMS';
import useCMSRow from '../../../hooks/useCmsRow';
import { EditorContext } from '../../../contexts/ElementRenderContext';

export const useRenderFields = (cmsFields = [], customSelected) => {
    const { useCollections } = useCMS();
    const {
        cmsRowAddr,
        selectedField,
        isNestedElement,
        cmsRowConfig = {},
    } = useCMSRow();
    const { page: { ref, slug: refSlug } = {} } = useContext(EditorContext);

    const { source, selectedCollection = {}, topicSlug } = cmsRowConfig;

    const selectedItem =
        customSelected ||
        (isNestedElement && selectedField) ||
        cmsRowConfig.selectedField;

    const input = {
        slug: cmsRowAddr ? selectedCollection.slug : refSlug,
        type: cmsRowAddr ? source : ref,
        selectedField: selectedItem,
        topicSlug,
    };
    const {
        fields: initialFields = [],
        handleSingleRefData,
        isLoading,
    } = useCollections(input);

    const fields = useMemo(() => {
        const hasExcludeVal = cmsFields.find((item) => item.startsWith('!'));
        const filteringCallback = (field) => {
            if (field.isUninitialized && !field.codes) {
                return true;
            }
            if (field.codes) {
                field.codes = field.codes.filter(filteringCallback);
            }
            if (cmsFields.includes(`!${field.type}`)) {
                return false;
            } else {
                return !!hasExcludeVal || cmsFields.includes(field.type);
            }
        };
        return initialFields.filter(filteringCallback);
    }, [cmsFields, initialFields]);

    return { fields, handleSingleRefData, isLoading };
};
