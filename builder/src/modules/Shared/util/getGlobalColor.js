export const getGlobalColor = ({ currentColor, globalColors }) => {
    const { key } =
        /var\((?<key>--color-\d+)\)/gi.exec(currentColor)?.groups || {};
    if (key) {
        currentColor = globalColors.find((col) => col.key === key);
    }
    return currentColor;
};
