const useLocalStorage = () => {
    const getItem = (key) => {
        const item = localStorage.getItem(key);
        return item && JSON.parse(item);
    };

    const setItem = (key, data) => {
        return localStorage.setItem(key, JSON.stringify(data));
    };

    const removeItem = (key) => {
        return localStorage.removeItem(key);
    };

    const clearStorage = () => {
        return localStorage.clear();
    };

    return {
        setItem,
        getItem,
        removeItem,
        clearStorage,
    };
};

export default useLocalStorage;
