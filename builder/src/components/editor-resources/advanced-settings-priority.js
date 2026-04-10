const advanceSettings = {
    default: [
        {
            hoverControl: false,
            label: 'Fonts & Typography',
            modules: [
                {
                    path: 'style',
                    content: {
                        template: 'CustomFonts',
                    },
                },
            ],
        },
        {
            hoverControl: false,
            label: 'FlexItem Styling',
            conditions: [
                ['/parentType', '===', 'container'],
                '&&',
                ['/type', '!==', 'container'],
            ],
            modules: [
                {
                    path: 'containerItem/style/alignSelf',
                    content: {
                        label: 'Align Self',
                        template: 'Tab',
                        inputType: 'boxed',
                        defaultValue: '',
                        labelExtra: true,
                        labelPosition: 'inline',
                        isResponsible: true,
                        options: [
                            { value: '', label: 'None', icon: 'far xmark' },
                            {
                                value: 'flex-start',
                                label: 'Start',
                                icon: 'far objects-align-top',
                            },
                            {
                                value: 'center',
                                label: 'Center',
                                icon: 'far objects-align-center-vertical',
                            },
                            {
                                value: 'flex-end',
                                label: 'End',
                                icon: 'far objects-align-bottom',
                            },
                            {
                                value: 'stretch',
                                label: 'Stretch',
                                icon: 'far arrows-from-line',
                            },
                        ],
                    },
                },
                {
                    path: 'containerItem/style/order',
                    content: {
                        label: 'Order',
                        isResponsible: true,
                        defaultValue: 0,
                        template: 'Range',
                        allowedUnits: false,
                    },
                },
                {
                    path: 'containerItem/style/flexGrow',
                    content: {
                        label: 'Flex Grow',
                        isResponsible: true,
                        defaultValue: 0,
                        template: 'Range',
                        allowedUnits: false,
                    },
                },
            ],
        },
        {
            hoverControl: false,
            label: 'Animation On Scroll',
            modules: [
                'animation/type',
                {
                    conditions: [
                        ['animation/type', '!=', null],
                        '&&',
                        ['animation/type', '!=', ''],
                    ],
                    modules: [
                        'animation/easing',
                        'animation/duration',
                        'animation/delay',
                        'animation/offset',
                        'animation/once',
                        'animation/mirror',
                        'animation/anchorPlacement',
                    ],
                },
            ],
        },
        {
            hoverControl: false,
            label: 'HTML SELECTORS',
            modules: ['attr/id', { path: 'attr/__data' }],
        },
        {
            hoverControl: false,
            label: 'Hover Transition',
            modules: ['style/transition'],
        },
        {
            hoverControl: false,
            label: 'Visibility & Position',
            modules: [
                'settings/hideOn',
                'style/overflowX',
                'style/overflowY',
                'style/zIndex',
            ],
        },
        {
            hoverControl: false,
            label: 'Custom Style',
            modules: [
                {
                    path: 'advanced/customStyle/general',
                    content: {
                        template: 'CodeEditor',
                        label: 'General CSS',
                        mode: 'css',
                        placeholder: `font-size: 16px;\nline-height: 1.5;\ncolor: red;\nborder: 10px solid black`,
                    },
                    // validation: {
                    //     validate: (value) => {
                    //         const regx = /[\w-]+:\s?.+;\n?$/gim;
                    //         return regx.test(value);
                    //     },
                    //     message: 'The CSS you entered is invalid',
                    // },
                },
                {
                    path: 'advanced/customStyle/&:before',
                    content: {
                        template: 'CodeEditor',
                        label: '`Before` CSS',
                        mode: 'css',
                        placeholder: `content: "demo content";\nline-height: 1.5;\ncolor: red;\nborder: 10px solid black`,
                    },
                },
                {
                    path: 'advanced/customStyle/&:after',
                    content: {
                        template: 'CodeEditor',
                        label: '`After` CSS',
                        mode: 'css',
                        placeholder: `content: "demo content";\nline-height: 1.5;\ncolor: red;\nborder: 10px solid black`,
                    },
                },
            ],
        },
    ],
    _section: [
        {
            hoverControl: false,
            label: 'Animation On Scroll',
            modules: [
                'animation/type',
                {
                    conditions: [
                        ['animation/type', '!=', null],
                        '&&',
                        ['animation/type', '!=', ''],
                    ],
                    modules: [
                        'animation/easing',
                        'animation/duration',
                        'animation/delay',
                        'animation/offset',
                        'animation/once',
                        'animation/mirror',
                        'animation/anchorPlacement',
                    ],
                },
            ],
        },
        { hoverControl: false, label: 'HTML ID', modules: ['attr/id'] },
        {
            hoverControl: false,
            label: 'Hover Transition',
            modules: ['style/transition'],
        },
        {
            hoverControl: false,
            label: 'Visibility & Position',
            modules: [
                // 'style/display',
                'style/overflowX',
                'style/overflowY',
                'style/zIndex',
            ],
        },
    ],
};

export default advanceSettings;
