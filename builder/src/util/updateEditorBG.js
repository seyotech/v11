export const updateEditorBG = (wrapper) => {
    if (!wrapper) return;
    let background = '';
    const spansWithoutBG = wrapper.querySelectorAll(
        "span[style*='color']:not([style*='background-color'])"
    );

    for (let span of spansWithoutBG) {
        const textColor = window.getComputedStyle(span).color;

        // getting rgb color code (currently we are adding inline rgb color)
        const [r, g, b] = textColor.match(/\d+/g).map(Number);

        // If the text color is light (near white)
        if (r > 220 && g > 220 && b > 220) {
            background = 'background-color: rgba(0,0,0,.2);';
            break;
        }
    }
    // Apply the background only if it has changed
    if (wrapper.style.cssText !== background) {
        wrapper.style.cssText = background;
    }
};
