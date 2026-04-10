import webfonts from '@dorik/webfonts';
import RenderTemplate from 'components/setting-components/core/RenderTemplate';
import { useState } from 'react';
import { googleFontWeightList as fontWeightList } from '../data/fonts';
import { getGoogleFontsModules } from '../utils/fonts';

function GoogleFont({ name, value = {}, onChange }) {
    const [font, setFont] = useState({
        family: value.fontFamily,
        fontWeight: value.fontWeight || [],
        fallbackTo: value.fallbackTo,
    });
    const handleFontFamily = (value) => {
        setFont((prev) => {
            return { ...prev, family: value };
        });
        if (value) {
            onChange([
                { name: `${name}/fontFamily`, value },
                {
                    name: `${name}/fallbackTo`,
                    value: webfonts.find((webfont) => webfont.family === value)
                        ?.category,
                },
            ]);
        }
    };

    const handleFontWeight = (value) => {
        setFont((prev) => {
            return { ...prev, fontWeight: value };
        });
        if (value) {
            onChange({ name: `${name}/fontWeight`, value });
        }
    };

    const selectedFont = webfonts.find(
        (webfont) => webfont.family === font.family
    );

    const fontWeights = fontWeightList.filter(
        ([value]) => selectedFont && selectedFont.variants.includes(value)
    );

    const modules = getGoogleFontsModules({ font, fontWeights });

    const handleGoogleFonts = ({ name, value }) => {
        const handler = {
            fontFamily: handleFontFamily,
            fontWeight: handleFontWeight,
        }[name];

        if (typeof handler === 'function') handler(value);
    };

    return (
        <>
            {modules.map((module, key) => (
                <RenderTemplate
                    {...module}
                    key={key}
                    module={module}
                    onChange={handleGoogleFonts}
                />
            ))}
        </>
    );
}

export default GoogleFont;
