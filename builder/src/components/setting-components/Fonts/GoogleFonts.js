import React, { useState } from 'react';
import webfonts from '@dorik/webfonts';
import Label from '../Label/Label';
import { Select } from 'antd';

const { Option } = Select;

function sortByFamily(a, b) {
    a = a.family.toLowerCase();
    b = b.family.toLowerCase();
    return a < b ? -1 : a > b ? 1 : 0;
}

const fontWeightList = [
    ['100', 'Thin 100'],
    ['100italic', 'Thin 100 Italic'],
    ['200', 'Extra-light 200'],
    ['200italic', 'Extra-light 200 Italic'],
    ['300', 'Light 300'],
    ['300italic', 'Light 300 Italic'],
    ['400', 'Regular 400'],
    ['400italic', 'Italic 400'],
    ['500', 'Medium 500'],
    ['500italic', 'Medium 500 Italic'],
    ['600', 'Semi-bold 600'],
    ['600italic', 'Semi-bold 600 Italic'],
    ['700', 'Bold 700'],
    ['700italic', 'Bold 700 Italic'],
    ['800', 'Extra-bold 800'],
    ['800italic', 'Extra-bold 800 Italic'],
    ['900', 'Black 900'],
    ['900italic', 'Black 900 Italic'],
];

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

    return (
        <div className="custom-font">
            <Label style={{ marginTop: '10px' }}>Font Family</Label>
            <Select
                showSearch
                value={font.family}
                placeholder="Select Font Family"
                onSelect={handleFontFamily}
                size="middle"
            >
                <Option value="">None</Option>
                {webfonts.sort(sortByFamily).map((font, index) => (
                    <Option key={index} value={font.family}>
                        {font.family}
                    </Option>
                ))}
            </Select>

            {font.family && (
                <>
                    <Label>Font Weight</Label>
                    <Select
                        mode="multiple"
                        maxTagCount="responsive"
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Please select"
                        defaultValue={font.fontWeight?.filter((v) => v)}
                        onChange={handleFontWeight}
                        size="middle"
                    >
                        {fontWeights.map(([value, label], idx) => (
                            <Option key={idx} value={value}>
                                {label}
                            </Option>
                        ))}
                    </Select>
                </>
            )}
        </div>
    );
}

export default GoogleFont;
