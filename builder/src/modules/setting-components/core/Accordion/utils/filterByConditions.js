import condition from 'dynamic-condition';
import resolveValues from 'util/resolveValues';

export const filterByConditions = ({
    user,
    group,
    appName,
    currentEditItem,
}) => {
    const { conditions, inView, moduleFilter } = group;

    // Check if moduleFilter is exist, first called this function before any other check
    if (moduleFilter) {
        return moduleFilter({ appName, user });
    }

    // If conditions are not specified, check if group.inView includes appName
    if (!conditions) {
        return inView?.includes(appName) ?? true;
    }

    // Check if conditions are matched
    const matchesConditions = condition(
        resolveValues(conditions, currentEditItem)
    ).matches;

    // If group.inView exists, check if appName is included and conditions are matched
    // Else, only check if the conditions are matched
    return inView
        ? inView.includes(appName) && matchesConditions
        : matchesConditions;
};
