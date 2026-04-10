const getPath = (module) => {
    if (typeof module === 'string') return module;
    return module.path;
};

export default getPath;
