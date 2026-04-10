import React, { useState } from 'react';
import Label from './Label/Label';

import webfonts from '@dorik/webfonts';
import getPathValue from '../../util/getPathValue';
import DataList from '../DataList';
import NativeSelect from './CustomSelect';

function sortByFamily(a, b) {
    a = a.family.toLowerCase();
    b = b.family.toLowerCase();

    return a < b ? -1 : a > b ? 1 : 0;
}

// Google Font API: https://www.googleapis.com/webfonts/v1/webfonts?key=${GOOGLE_FONT_API_KEY}

// const mizan = webfonts.map(font => {
//     const { subsets, version, files, ...rest } = font;

//     return { ...rest, provider: 'googlefont' };
// });

const fontWeightList = [
    ['100', 'Thin 100'],
    ['100italic', 'Thin 100 Italic'],
    ['200', 'Extra-light 200'],
    ['200italic', 'Extra-light 200 Italic'],
    ['300', 'Light 300'],
    ['300italic', 'Light 300 Italic'],
    ['400', 'Regular 400'],
    ['italic', 'Italic 400'],
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

function FontSelection(props) {
    const {
        currentEditItem,
        module: { modules },
        handleChange: onChange,
    } = props;
    const [fontFamily, fontWeight] = modules.map((path) =>
        getPathValue(path, currentEditItem)
    );

    const [font, setFont] = useState({
        family: fontFamily,
        weight: fontWeight,
    });
    const handleChange = (name) => (result) => {
        const nextState = { ...font, [name]: result.value };
        if (name === 'family') {
            nextState.weight = '';
            setFont(nextState);
        } else {
            setFont(nextState);
        }

        const data = modules.map((mdl) => {
            let temp = {};
            if (mdl.includes('Family')) {
                temp = { name: mdl, value: nextState.family };
            }
            if (mdl.includes('Weight')) {
                temp = { name: mdl, value: nextState.weight };
            }
            return temp;
        });
        onChange(data);
    };
    const selectedFont = webfonts.find(
        (webfont) => webfont.family === font.family
    );
    const fontWeights = fontWeightList.filter(
        ([value]) => selectedFont && selectedFont.variants.includes(value)
    );

    return (
        <>
            <Label>Font Family</Label>
            <DataList
                listId="fontlist"
                value={font.family}
                placeholder="Select Font"
                onSelect={handleChange('family')}
                // clearIcon={<FontAwesomeIcon icon={['fas', 'times-circle']} />}
            >
                {webfonts.sort(sortByFamily).map((font, idx) => (
                    <option key={idx} value={font.family} />
                ))}
            </DataList>
            {/* TODO: refactor the code later. It sould be used via render element */}
            {modules[1] && font.family && (
                <>
                    <Label>Font Weight</Label>
                    <NativeSelect
                        value={font.weight}
                        placeholder="Select Font Weight"
                        onSelect={handleChange('weight')}
                    >
                        <option value="">None</option>
                        {fontWeights.map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </NativeSelect>
                </>
            )}
        </>
    );
}

export default React.memo(FontSelection);
