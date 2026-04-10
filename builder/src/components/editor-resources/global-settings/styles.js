import { appName } from '../../../config';
import { dateFormats } from '../../../util';
import { makeBgSettings } from '../compound-settings';

const defaultStyle = {
    default: [
        {
            hoverControl: false,
            label: 'Body Background',
            modules: makeBgSettings('style', ['color', 'image']),
        },
        {
            hoverControl: false,
            label: 'Body / Paragraph Typography',
            modules: [
                {
                    path: 'style/fontSize',
                    content: { isResponsible: true, defaultValue: '16px' },
                },
                {
                    hoverable: false,
                    isResponsible: true,
                    template: 'FontSpaceLH',
                    label: 'Spacing & Line Height',
                    modules: [
                        {
                            path: 'style/lineHeight',
                            content: { defaultValue: '24px' },
                        },
                        'style/letterSpacing',
                    ],
                },
                'style/color',
            ],
        },
        {
            hoverControl: false,
            label: 'Heading Typography',
            modules: [
            ],
        },
        {
            hoverControl: false,
            label: 'Container & Column',
            modules: [
                {
                    path: 'settings/containerWidth',
                    content: {
                        min: 0,
                        max: 5000,
                        defaultUnit: 'px',
                        template: 'Range',
                        defaultValue: '1140px',
                        label: 'Container Width',
                    },
                },
                {
                    path: 'settings/columnGap',
                    content: {
                        min: 0,
                        max: 150,
                        defaultUnit: 'px',
                        template: 'Range',
                        defaultValue: '30px',
                        label: 'Default Column Gap',
                    },
                },
            ],
        },
        {
            hoverControl: false,
            label: 'Link Style',
            modules: [
                {
                    path: 'tags/a/style/color',
                    content: {
                        template: 'ColorPicker',
                        label: 'Color',
                    },
                },
                {
                    path: 'tags/a/style/_textDecoration',
                    content: {
                        onLabel: 'ON',
                        offLabel: 'OFF',
                        offValue: 'none',
                        label: 'Underline',
                        template: 'Switch',
                        labelPosition: 'inline',
                        onValue: 'underline',
                        defaultValue: 'underline',
                    },
                },
            ],
        },
        {
            hoverControl: false,
            label: 'Date Settings',
            inView: appName.CMS,
            modules: [
                {
                    path: 'date/format',
                    content: dateFormats,
                },
            ],
        },
    ],
};

export default defaultStyle;
