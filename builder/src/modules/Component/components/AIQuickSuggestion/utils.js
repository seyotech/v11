import { generateColorVariations } from 'modules/AI/utils/generateColorVariations';
import { nanoid } from 'nanoid';

export const getColorVariation = (brandColor) => {
    const colors = generateColorVariations(brandColor);
    const displayColors = [
        '--color-1',
        '--color-2',
        '--color-104',
        '--color-14',
    ].map((key) => {
        return colors.find((item) => item.key === key);
    });

    return {
        displayColors,
        colors,
    };
};
export const getColorPalette = (colors) => {
    return colors.map((brandColor) => {
        return getColorVariation(brandColor);
    });
};

export const getRandomNumber = (arr) => {
    return Math.floor(Math.random() * arr.length);
};
export const getFontsBuildStr = (fonts = []) => {
    const fontItems = fonts.flatMap((item) => Object.values(item));
    const uniqueFonts = [
        ...new Map(fontItems.map((item) => [item.name, item])).values(),
    ];

    function plusify(str) {
        return str.replace(/\s/g, '+');
    }
    let fontFamilies = uniqueFonts
        .map((font) => {
            let fontString = '';
            fontString += plusify(font.name);
            if (font) {
                fontString += `:${font.weight}`;
            }
            return fontString;
        })
        .join('|');

    const fontUrl = `https://fonts.googleapis.com/css?family=${fontFamilies}&display=swap`;
    return { fontUrl, fontFamilies };
};

export const generateColorPayload = ({ global, colors }) => {
    const existingColors = global.settings.colors || [];
    const globalColors = [
        ...new Map(
            [...existingColors, ...colors].map((color) => [color.key, color])
        ).values(),
    ];

    return globalColors;
};
export const generateFontPayload = ({ global, heading = {}, body = {} }) => {
    const style = {
        ...global.style,
        fontFamily: body.name,
    };

    // Generate global heading fonts
    const _heading = {};
    Object.entries(global.heading).forEach(([level, value]) => {
        const obj = {
            ...value,
            style: {
                ...value.style,
                fontWeight: heading.weight,
                fontFamily: heading.name,
            },
        };
        _heading[level] = obj;
    });

    const headingFont = {
        id: `ai_${nanoid(6)}`,
        font: {
            fontFamily: heading.name,
            fontWeight: [`${heading.weight}`],
            fallbackTo: heading.type,
        },
    };
    const bodyFont = {
        id: `ai_${nanoid(6)}`,
        font: {
            fontFamily: body.name,
            fontWeight: [`${body.weight}`],
            fallbackTo: body.type,
        },
    };

    const existingGoogleFonts =
        global.settings?.googleFonts?.filter((font) => {
            const [ai] = font.id.split('_');
            return ai !== 'ai';
        }) || [];

    const googleFonts = [
        ...new Map(
            [...existingGoogleFonts, headingFont, bodyFont].map((item) => {
                const obj = { ...item };
                const matchedFont = existingGoogleFonts.find(
                    ({ font }) => font.fontFamily === item.font.fontFamily
                );
                if (matchedFont) {
                    const arr = [
                        ...matchedFont.font.fontWeight,
                        ...item.font.fontWeight,
                    ];
                    obj.font.fontWeight = Array.from(new Set(arr));
                    obj.id = matchedFont.id;
                }

                return [item.font?.fontFamily, obj];
            })
        ).values(),
    ];

    return { style, heading: _heading, googleFonts };
};
