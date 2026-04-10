export default function validateMembership(availableIn, user) {
    if (!user || !availableIn) {
        return true;
    } else if (user.roles?.includes('ADMIN')) {
        return true;
    } else if (availableIn) {
        const found = availableIn.find((v) => user.roles?.includes(v));
        return !!found;
    } else {
        return true;
    }
}
