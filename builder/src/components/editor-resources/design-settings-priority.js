const designSettings = {
    default: [
        {
            hoverControl: false,
            label: 'Margin & Padding',
            modules: ['style/margin', 'style/padding'],
        },
        {
            label: 'Border',
            modules: [
                {
                    template: 'Border',
                    modules: [
                        {
                            path: 'width',
                            content: {
                                defaultUnit: 'px',
                                template: 'Range',
                                isResponsible: true,
                                label: 'Border Width',
                            },
                        },
                        {
                            path: 'style',
                            content: {
                                label: 'Border Style',
                                labelPosition: 'inline',
                                template: 'Select',
                                options: [
                                    { value: '', name: 'None' },
                                    { value: 'solid', name: 'Solid' },
                                    { value: 'dashed', name: 'Dashed' },
                                    { value: 'dotted', name: 'Dotted' },
                                    { value: 'double', name: 'Double' },
                                    { value: 'ridge', name: 'Ridge' },
                                    { value: 'groove', name: 'Groove' },
                                    { value: 'inset', name: 'Inset' },
                                    { value: 'outset', name: 'Outset' },
                                ],
                            },
                        },
                        {
                            path: 'color',
                            content: {
                                hoverable: true,
                                template: 'ColorPicker',
                                label: 'Border Color',
                            },
                        },
                    ],
                },
            ],
        },
        {
            label: 'Radius / Rounded Corner',
            modules: ['style/borderRadius'],
        },
        {
            label: 'Box Shadow',
            modules: [
                'style/boxShadow/type',
                {
                    label: 'Shadow Offset',
                    isResponsible: true,
                    hoverable: true,
                    modules: ['style/boxShadow/x', 'style/boxShadow/y'],
                    conditions: [
                        ['style/boxShadow/type', '!=', null],
                        '&&',
                        ['style/boxShadow/type', '!==', 'none'],
                    ],
                },
                {
                    conditions: [
                        ['style/boxShadow/type', '!=', null],
                        '&&',
                        ['style/boxShadow/type', '!=', 'none'],
                    ],
                    modules: [
                        'style/boxShadow/blur',
                        'style/boxShadow/spread',
                        'style/boxShadow/color',
                    ],
                },
            ],
        },
        {
            label: 'Transform',
            modules: [
                {
                    label: 'Rotate',
                    isResponsible: true,
                    hoverable: true,
                    modules: [
                        'style/transform/rotateX',
                        'style/transform/rotateY',
                        'style/transform/rotateZ',
                    ],
                },
                {
                    label: 'Scale',
                    isResponsible: true,
                    hoverable: true,
                    modules: ['style/transform/scale'],
                },
                {
                    label: 'Translate',
                    isResponsible: true,
                    hoverable: true,
                    modules: [
                        'style/transform/translateX',
                        'style/transform/translateY',
                    ],
                },
                {
                    label: 'Skew',
                    isResponsible: true,
                    hoverable: true,
                    modules: ['style/transform/skewX', 'style/transform/skewY'],
                },
            ],
        },
    ],
};

export default designSettings;
