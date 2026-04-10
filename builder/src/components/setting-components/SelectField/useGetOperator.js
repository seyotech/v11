import { useMemo } from 'react';
import {
    fieldTypesEnum,
    dateFilterOperators,
    textFilterOperators,
    numberFilerOperators,
    multiFilterOperators,
    commonFilterOperators,
    textOnlyFilterOperators,
} from '../../../constants/cmsData';

export const useGetOperator = (type, ignoreOptions = []) => {
    return useMemo(() => {
        switch (type) {
            case fieldTypesEnum.TEXT:
                return textFilterOperators
                    .concat(textOnlyFilterOperators)
                    .concat(commonFilterOperators)
                    .filter(
                        (operator) => !ignoreOptions.includes(operator.value)
                    );
            case fieldTypesEnum.EMAIL:
            case fieldTypesEnum.SINGLE_SELECT:
            case fieldTypesEnum.SINGLE_REFERENCE:
                return textFilterOperators.concat(commonFilterOperators);
            case fieldTypesEnum.LINK:
            case fieldTypesEnum.IMAGE:
            case fieldTypesEnum.RICH_TEXT:
                return commonFilterOperators;

            case fieldTypesEnum.NUMBER:
                return numberFilerOperators.concat(commonFilterOperators);

            case fieldTypesEnum.DATE:
                return dateFilterOperators.concat(commonFilterOperators);

            case fieldTypesEnum.MULTI_SELECT:
            case fieldTypesEnum.MULTI_REFERENCE:
                return multiFilterOperators.concat(commonFilterOperators);

            default:
                return [];
        }
    }, [ignoreOptions, type]);
};
