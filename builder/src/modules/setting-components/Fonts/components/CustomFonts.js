import debounce from 'lodash.debounce';
import RenderTemplate from 'components/setting-components/core/RenderTemplate';
import { EditorContext } from 'contexts/ElementRenderContext';
import { useCallback, useContext, useState } from 'react';
import { customFontWeightList as fontWeightList } from '../data/fonts';
import { getCustomFontsModules } from '../utils/fonts';

let fontFamilyMod = (value) => {
    if (!value) return '';
    return (
        value.substr(1, value.indexOf(',') - 2) || value.replace(/['"]+/g, '')
    );
};

function CustomFonts(props) {
    let { name = 'style', value: elStyles = {}, onChange = () => {} } = props;
    const {
        currentEditItem: { _elType },
    } = useContext(EditorContext);

    const [font, setFont] = useState({
        family: fontFamilyMod(elStyles.fontFamily),
        weight: elStyles.fontWeight,
        style: elStyles.fontStyle,
    });

    const { global } = useContext(EditorContext);
    let {
        customFonts = [],
        defaultFonts = [],
        typekitFonts = {},
        googleFonts = [],
    } = global.settings || {};

    //Google font modification
    let modifyGoogleFont = googleFonts.map(({ font = {} }) => {
        let weight = font.fontWeight
            ?.map((weight) => weight?.substring(0, 3))
            .filter((v) => v);

        let style = font.fontWeight
            ?.map((weight) => weight?.substring(3))
            .filter((item) => item);
        let fallbackTo = font.fallbackTo;
        return { label: font.fontFamily, weight, style, fallbackTo };
    });

    //typekit font modification
    let typekitFontsModify =
        typekitFonts?.family
            ?.map((font) => {
                return {
                    label: font,
                    weight: typekitFonts.weight,
                    fallbackTo: typekitFonts.fallbackTo,
                };
            })
            .filter((v) => v) || [];

    // fonts marged
    let fonts = [
        ...modifyGoogleFont,
        ...customFonts,
        ...typekitFontsModify,
        ...defaultFonts,
    ];

    let selectedFont = fonts.filter((item) => item.label === font.family);

    //fallback fonts
    let fallbackFonts = (selectedFont) => {
        return selectedFont
            .map((item) => item.fallbackTo)
            .filter((item, index, arr) => item && arr.indexOf(item) === index)
            .map((item) => {
                return `${item}`;
            })
            .join(',');
    };

    //font familys opts
    const fontFamilies = fonts
        .map((font) => font.label)
        .filter((item, index, arr) => item && arr.indexOf(item) === index);

    //font weights opts
    let fontWeights = fontWeightList
        .map((item) => {
            let fontWeight = selectedFont.map((item) => item?.weight);

            if (font.family && fontWeight.flat().includes(item.value)) {
                return item;
            }
        })
        .filter((item) => item);

    fontWeights = !font.family ? fontWeightList : fontWeights;

    //font styles opts
    const fontStyles = selectedFont
        .map((font) => font.style)
        .flat()
        .filter((item, index, arr) => item && arr.indexOf(item) === index);

    const debounceOnChange = useCallback(
        debounce((payload) => {
            onChange(payload);
        }, 100),
        [onChange]
    );

    const handleFontFamily = (value) => {
        setFont((prev) => {
            return { ...prev, family: value, weight: '' };
        });
        if (value) {
            let selected = fonts.filter((item) => item.label === value);
            debounceOnChange([
                {
                    name: `${name}/fontFamily`,
                    value: `'${value}'${
                        fallbackFonts(selected) && `,${fallbackFonts(selected)}`
                    }`,
                },
                { name: `${name}/fontWeight`, value: '' },
            ]);
        } else {
            ['fontFamily', 'fontWeight', 'fontStyle'].forEach(
                (item) => delete elStyles[item]
            );

            debounceOnChange({ name, value: elStyles });
        }
    };

    const handleFontWeight = (value) => {
        setFont((prev) => {
            return { ...prev, weight: value };
        });
        if (value) {
            delete elStyles.fontStyle;
            onChange({
                name: `${name}/fontWeight`,
                value,
            });
        } else {
            delete elStyles.fontWeight;
            onChange({ name, value: elStyles });
        }
    };

    const handleFontStyle = (value) => {
        setFont((prev) => {
            return { ...prev, style: value };
        });
        if (value) {
            onChange({ name: `${name}/fontStyle`, value });
        } else {
            delete elStyles.fontStyle;
            onChange({ name, value: elStyles });
        }
    };

    const handleCustomFonts = ({ name, value }) => {
        const handler = {
            fontStyle: handleFontStyle,
            fontFamily: handleFontFamily,
            fontWeight: handleFontWeight,
        }[name];

        if (typeof handler === 'function') handler(value);
    };

    const modules = getCustomFontsModules({
        font,
        _elType,
        fontStyles,
        fontFamilies,
        fontWeights,
        handleFontFamily,
    });

    return (
        <>
            {modules.map((module, key) => (
                <RenderTemplate
                    {...module}
                    key={key}
                    module={module}
                    onChange={handleCustomFonts}
                />
            ))}
        </>
    );
}

export default CustomFonts;
