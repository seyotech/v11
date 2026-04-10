export default function validateMembership({ excludePlans, user, planKey }) {
    if (
        !user ||
        !excludePlans ||
        ['sys_admin', 'sys_reviewer'].includes(user?.role)
    ) {
        return true;
    } else if (excludePlans) {
        return !excludePlans.find(
            (excludePlanKey) => excludePlanKey === planKey
        );
    } else {
        return true;
    }
}
