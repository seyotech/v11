export default function buildFontString(element = {}) {
    let fonts = [];
    const { style, settings: { googleFonts = [] } = {} } = element;

    if (style?.fontFamily) {
        let styleModily = {
            ...style,
            fontFamily: style.fontFamily.split("'")[1],
        };
        fonts.push({ style: styleModily });
    }

    let googleFontsStyle = googleFonts?.map(({ font }) => {
        return { style: font || {} };
    });
    fonts = googleFontsStyle.length ? [...fonts, ...googleFontsStyle] : fonts;

    return fonts
        .reduce(fontReducer, [])
        .map((font) => {
            let fontString = '';
            if (font.fontFamily) {
                fontString += plusify(font.fontFamily);
                if (font.fontWeights.length) {
                    fontString += `:${font.fontWeights.join(',')}`;
                }
            }
            return fontString;
        })
        .filter((v) => v)
        .join('|');
}

function plusify(str) {
    return str.replace(/\s/g, '+');
}

function fontReducer(acc, next) {
    const { fontFamily = '', fontWeight = '' } = next.style;
    const found = acc.find((font) => font.fontFamily === fontFamily);
    if (!found) {
        const fontWeights = [];
        fontWeight && fontWeights.push(fontWeight);
        return acc.concat({ fontFamily, fontWeights });
    } else {
        fontWeight && found.fontWeights.push(fontWeight);
        return acc;
    }
}
