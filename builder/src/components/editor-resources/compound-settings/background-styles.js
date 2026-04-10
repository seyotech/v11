import ucFirst from '../../../util/ucFirst';
import { overlaySettings } from './overlay-settings';

/**
 * @param {string} [prefix]
 * @param {string[]} [types] 'color', and 'image'
 */
const getBgIcon = (type) => {
    return {
        color: 'far droplet',
        image: 'far image',
        video: 'far video',
    }[type];
};

export const makeBgSettings = (
    prefix = 'style',
    types = ['color'],
    activeOverlay = true
) => {
    return [
        {
            path: `${prefix}/__backgroundType`,
            content: {
                visibleOn: ['normal', 'hover'],
                template: 'Tab',
                inputType: 'boxed',
                defaultValue: 'color',
                label: 'Background',
                labelPosition: 'inline',
                options: types.map((type) => ({
                    value: type,
                    label: ucFirst(type),
                    icon: getBgIcon(type),
                })),
            },
        },
        {
            path: `${prefix}/backgroundColor`,
            content: {
                hoverable: true,
                inputType: 'color',
                placeholder: 'eg: #ff00ff',
                label: 'Color',
                template: 'ColorPicker',
            },
            conditions: [
                [`${prefix}/__backgroundType`, '===', undefined],
                '||',
                [`${prefix}/__backgroundType`, '===', 'color'],
            ],
        },

        {
            conditions: [`${prefix}/__backgroundType`, '===', 'image'],
            modules: [
                {
                    resetDep: false,
                    path: `${prefix}/backgroundImage/image`,
                    dependentsValue: {
                        [`${prefix}/backgroundSize`]: 'cover',
                        [`${prefix}/backgroundPosition`]: 'center',
                        [`${prefix}/backgroundRepeat`]: 'no-repeat',
                    },
                },
                `${prefix}/backgroundSize`,
                `${prefix}/backgroundPosition`,
                {
                    path: `${prefix}/backgroundAttachment`,
                    content: {
                        label: 'Attachment',
                        template: 'Tab',
                        inputType: 'boxed',
                        defaultValue: 'scroll',
                        labelPosition: 'inline',
                        options: [
                            { label: 'Scroll', value: 'scroll' },
                            { label: 'Fixed', value: 'fixed' },
                        ],
                    },
                },
                `${prefix}/backgroundRepeat`,
                `${prefix}/backgroundBlendMode`,
                ...(activeOverlay ? overlaySettings() : []),
            ],
        },
        // video
        {
            conditions: [`${prefix}/__backgroundType`, '===', 'video'],
            hoverControl: false,
            modules: [
                {
                    path: 'sources/mp4',
                    content: {
                        size: 16,
                        type: 'video',
                        label: 'MP4 Video',
                        accept: 'video/mp4',
                        template: 'ImagePreview',
                        addButtonText: 'Upload New Video',
                    },
                },
                {
                    path: 'sources/webm',
                    content: {
                        size: 16,
                        type: 'video',
                        accept: 'video/webm',
                        label: 'WEBM Video',
                        template: 'ImagePreview',
                        addButtonText: 'Upload New Video',
                    },
                },
                'attr/poster',
                {
                    path: `video/${prefix}/position`,
                    content: {
                        label: 'Attachment',
                        template: 'Tab',
                        inputType: 'boxed',
                        defaultValue: 'absolute',
                        options: [
                            { label: 'Scroll', value: 'absolute' },
                            { label: 'Fixed', value: 'fixed' },
                        ],
                    },
                },
                {
                    path: 'video/attr/__class__overlayType',
                    content: {
                        template: 'Tab',
                        inputType: 'boxed',
                        defaultValue: 'none',
                        label: 'Overlay Style',
                        labelPosition: 'inline',
                        options: [
                            { value: 'none', label: 'none', icon: 'far xmark' },
                            {
                                value: 'color-overlay',
                                label: 'Color overlay',
                                icon: 'far droplet',
                            },
                        ],
                    },
                },
                {
                    path: 'video/pseudoClass/before/style/backgroundColor',
                    conditions: [
                        'video/attr/__class__overlayType',
                        '===',
                        'color-overlay',
                    ],
                    content: {
                        template: 'ColorPicker',
                        placeholder: 'eg: #ff00ff',
                    },
                },
            ],
        },
    ];
};

export default makeBgSettings();
