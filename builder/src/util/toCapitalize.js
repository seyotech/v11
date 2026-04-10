export const toCapitalize = (str = '') => {
    return str
        .toLowerCase()
        .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
};
