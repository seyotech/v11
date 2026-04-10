const isError = (res) => {
    if (res?.errors.extensions.message) {
        return Object.values(res.errors.extensions.message)[0];
    }

    return false;
};

export default isError;
