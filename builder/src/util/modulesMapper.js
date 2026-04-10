const getCssModules = (path, modules, spliter = '/') =>
    path.split(spliter).reduce((a, c) => a[c], modules);

const modulesMapper =
    (prefix, modules) =>
    (path, modulePath = path) => {
        const cssModules = getCssModules(modulePath, modules) || [];
        return cssModules.flatMap((module) => {
            switch (typeof module) {
                case 'string':
                    if (modulePath === prefix) return `style/${module}`;
                    return `${prefix}/${path}/style/${module}`;
                case 'function':
                    return module(path);
                default:
                    return module;
            }
        });
    };

export default modulesMapper;
