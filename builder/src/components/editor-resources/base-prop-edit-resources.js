const basePropEditResources = {
    columnSize: {
        inputType: 'text',
        name: 'Column Size',
        template: 'input',
    },
    titleType: {
        template: 'Tab',
        inputType: 'boxed',
        label: 'Heading Tag',
        options: [
            {
                label: 'H1',
                value: 'h1',
            },
            {
                label: 'H2',
                value: 'h2',
            },
            {
                label: 'H3',
                value: 'h3',
            },
            {
                label: 'H4',
                value: 'h4',
            },
            {
                label: 'H5',
                value: 'h5',
            },
            {
                label: 'H6',
                value: 'h6',
            },
        ],
    },
    content: {
        label: 'Text',
        template: 'RichTextEditor',
        // inputType: 'textarea',
        // selectFont: true,
    },
    counter: {
        textStyle: {
            fontSize: {
                min: 10,
                max: 100,
                label: 'Text Size',
                template: 'Range',
                defaultUnit: 'px',
                isResponsible: true,
            },
            color: {
                hoverable: true,
                label: 'Text Color',
                template: 'ColorPicker',
            },
        },
        countStyle: {
            fontSize: {
                min: 10,
                max: 100,
                label: 'Number Size',
                template: 'Range',
                defaultUnit: 'px',
                isResponsible: true,
            },
            color: {
                hoverable: true,
                label: 'Number Color',
                template: 'ColorPicker',
            },
        },
        date: {
            label: 'Finishing Date',
            template: 'Input',
            inputType: 'date',
        },
        time: {
            label: 'Finishing Time',
            template: 'Input',
            inputType: 'time',
        },
        align: {
            template: 'Tab',
            inputType: 'boxed',
            label: 'Alignment',
            isResponsible: false,
            defaultValue: 'center',
            labelPosition: 'inline',
            options: [
                { label: 'Left', value: 'left', icon: 'far align-left' },
                { label: 'Center', value: 'center', icon: 'far align-center' },
                { label: 'Right', value: 'right', icon: 'far align-right' },
            ],
        },
    },
};

export default basePropEditResources;
