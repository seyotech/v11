export default function useGenCSSVars(colors) {
    let colStr = '';
    colors?.length > 0 &&
        colors.forEach((color) => {
            colStr += `${color.key}: ${color.value};`;
        });
    return colStr;
}
