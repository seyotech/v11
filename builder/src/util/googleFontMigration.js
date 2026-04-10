import defaultFonts from './defaultFonts';
export const fontMigration = (globalSetting) => {
    const { heading = {}, settings = {}, style = {}, version } = globalSetting;
    if (version >= '2.0.0') {
        return globalSetting;
    }

    let headingFonts = Object.entries(heading)
        .map(([tag, { style }]) => {
            if (!style.fontFamily) return;
            return {
                fontFamily: style.fontFamily,
                fontWeight: [style.fontWeight],
            };
        })
        .filter((v) => v);

    let styleFont = style.fontFamily && {
        fontFamily: style.fontFamily,
        fontWeight: [style.fontWeight],
    };
    const googleFonts = [...headingFonts, styleFont]
        .filter((v) => v)
        .reduce((prev, curr) => {
            let existFamily = prev.find(
                (item = {}) => item.font.fontFamily === curr.fontFamily
            );
            if (existFamily) {
                existFamily.font.fontWeight.push(...curr.fontWeight);
            } else {
                prev.push({ font: curr });
            }
            return prev;
        }, []);

    return {
        version: '2.0.0',
        ...globalSetting,
        settings: { ...settings, googleFonts, defaultFonts },
    };
};
