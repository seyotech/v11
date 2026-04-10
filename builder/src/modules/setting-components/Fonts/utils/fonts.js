import webfonts from '@dorik/webfonts';
import { t } from 'i18next';
import ucFirst from 'util/ucFirst';

function sortByFamily(a, b) {
    a = (a.family || a).toLowerCase();
    b = (b.family || b).toLowerCase();
    return a < b ? -1 : a > b ? 1 : 0;
}

export const getGoogleFontsModules = ({ font, fontWeights }) => [
    {
        showSearch: true,
        template: 'Select',
        name: 'fontFamily',
        value: font.family,
        label: t('Font Family'),
        placeholder: t('Select Font Family'),
        options: [
            {
                value: '',
                label: t('None'),
            },
            ...webfonts.sort(sortByFamily).map((font) => ({
                label: font.family,
                value: font.family,
            })),
        ],
    },
    {
        mode: 'multiple',
        allowClear: true,
        template: 'Select',
        name: 'fontWeight',
        label: t('Font Weight'),
        maxTagCount: 'responsive',
        placeholder: t('Please select'),
        conditions: [font.family, '!=', undefined],
        defaultValue: font.fontWeight?.filter((v) => v),
        options: fontWeights.map(([_value, label]) => ({
            value: _value === 'regular' ? '400' : _value,
            label,
        })),
    },
];

export const getCustomFontsModules = ({
    font,
    _elType,
    fontStyles,
    fontFamilies,
    fontWeights,
    handleFontFamily,
}) => [
    {
        showSearch: true,
        name: 'fontFamily',
        value: font.family,
        template: 'Select',
        label: t('Font Family'),
        placeholder: t('Select Font Family'),
        optionRender: ({ label, value }) => (
            <span
                style={{ display: 'inline-block', width: '100%' }}
                onMouseEnter={() => _elType && handleFontFamily(value)}
            >
                {label}
            </span>
        ),
        options: [
            {
                value: '',
                label: _elType ? t('Default') : t('None (System UI)'),
            },
            ...fontFamilies
                .sort(sortByFamily)
                .map((family) => ({ label: family, value: family })),
        ],
    },
    {
        showSearch: true,
        name: 'fontWeight',
        template: 'Select',
        value: font.weight,
        label: t('Font Weight'),
        placeholder: t('Select Font Weight'),
        options: [
            {
                value: '',
                label: _elType ? t('Default') : t('None'),
            },
            ...fontWeights,
        ],
    },
    {
        conditions: [
            [font.weight, '!=', undefined],
            '&&',
            [fontStyles.length, '>=', 1],
        ],
        value: font.style,
        name: 'fontStyle',
        template: 'Select',
        label: t('Font Style'),
        placeholder: t('Select Font style'),
        options: [
            {
                value: '',
                label: _elType ? t('Default') : t('None'),
            },
            ...fontStyles.flat().map((style) => ({
                value: style,
                label: ucFirst(style),
            })),
        ],
    },
];
