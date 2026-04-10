const getLoadPath = () => {
    const prefix = (history.state?.url || '').match(
        /^(?:(?:\/v4)?\/dashboard)?/
    )[0];
    const loadPath = prefix + '/locales/{{lng}}/{{ns}}.json';
    return loadPath;
};

export default getLoadPath;
