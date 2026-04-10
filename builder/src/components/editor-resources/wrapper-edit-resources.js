const wrapperEditResources = {
    textAlign: {
        template: 'Tab',
        label: 'Alignment',
        inputType: 'boxed',
        isResponsible: true,
        defaultValue: 'left',
        labelExtra: true,
        labelPosition: 'inline',
        options: [
            { label: 'Left', value: 'left', icon: 'far align-left' },
            { label: 'Center', value: 'center', icon: 'far align-center' },
            { label: 'Right', value: 'right', icon: 'far align-right' },
        ],
    },
    display: {
        inputType: 'select',
        label: 'Display',
        template: 'Select',
        labelPosition: 'inline',
        options: [
            {
                name: 'Block',
                value: 'block',
            },
            {
                name: 'Inline Block',
                value: 'inline-block',
            },
        ],
    },
    // ATTRIBUTES
    attr: {
        href: {
            label: 'URL',
            template: 'Input',
            inputType: 'url',
        },
        target: {
            template: 'Select',
            defaultValue: '',
            inputType: 'boxed',
            labelPosition: 'inline',
            label: 'Open Link In',
            options: [
                { label: 'Same Tab', value: '' },
                { label: 'New Tab', value: '_blank' },
                { label: 'New Window', value: '_new' },
            ],
        },
    },
};

export default wrapperEditResources;
