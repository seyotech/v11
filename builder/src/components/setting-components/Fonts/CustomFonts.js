import { EditorContext } from '../../../contexts/ElementRenderContext';
import React, { useContext, useState } from 'react';
import Label from '../Label/Label';
import { Select } from 'antd';
const { Option } = Select;

function sortByFamily(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    return a < b ? -1 : a > b ? 1 : 0;
}

const fontWeightList = [
    { value: '100', label: '100 ( Thin )' },
    { value: '200', label: '200 ( Extra Light )' },
    { value: '300', label: '300 ( Light )' },
    { value: '400', label: '400 ( Normal )' },
    { value: '500', label: '500 ( Medium )' },
    { value: '600', label: '600 ( Semi Bold )' },
    { value: '700', label: '700 ( Bold )' },
    { value: '800', label: '800 ( Extra Bold )' },
    { value: '900', label: '900 ( Black )' },
    { value: 'bold', label: 'Bold' },
    { value: 'lighter', label: 'Lighter' },
    { value: 'normal', label: 'Normal' },
    { value: 'bolder', label: 'Bolder' },
];

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
    const fontFamilys = fonts
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

    const handleFontSelect = (value) => {
        setFont((prev) => {
            return { ...prev, family: value, weight: '' };
        });
        if (value) {
            let selected = fonts.filter((item) => item.label === value);
            onChange([
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

            onChange({ name, value: elStyles });
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

    return (
        <div className="custom-font">
            <Label>Font Family</Label>
            <Select
                showSearch
                value={font.family}
                placeholder="Select Font Family"
                onSelect={handleFontSelect}
                size="middle"
            >
                <Option
                    key={'none'}
                    value=""
                    onMouseEnter={_elType ? () => handleFontSelect() : null}
                >
                    {_elType ? 'Default' : 'None (System UI) '}
                </Option>
                {fontFamilys.sort(sortByFamily).map((item, idx) => (
                    <Option
                        key={idx}
                        value={item}
                        onMouseEnter={
                            _elType ? () => handleFontSelect(item) : null
                        }
                    >
                        {item}
                    </Option>
                ))}
            </Select>

            <>
                <Label>Font Weight</Label>
                <Select
                    showSearch
                    value={font.weight}
                    placeholder="Select Font Weight"
                    onSelect={handleFontWeight}
                    size="middle"
                >
                    <Option value="" key="none">
                        {_elType ? 'Default' : 'None'}
                    </Option>
                    {fontWeights.map(({ label, value }, idx) => (
                        <Option key={idx} value={value}>
                            {label}
                        </Option>
                    ))}
                </Select>
            </>

            {font.weight && fontStyles.length ? (
                <>
                    <Label>Font Style</Label>
                    <Select
                        value={font.style}
                        placeholder="Select Font Weight"
                        onSelect={handleFontStyle}
                        size="middle"
                    >
                        <Option value="" key="none">
                            {_elType ? 'Default' : 'None'}
                        </Option>
                        {fontStyles.flat().map((style, idx) => (
                            <Option key={idx} value={style}>
                                {style.charAt(0).toUpperCase() + style.slice(1)}
                            </Option>
                        ))}
                    </Select>
                </>
            ) : null}
        </div>
    );
}

export default CustomFonts;
