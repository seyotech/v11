export const input1 = [
    {
        name: 'Name',
        code: '{{name}}',
        type: 'TEXT',
        value: '{{name}}',
    },
    {
        name: 'Email',
        code: '{{name}}',
        value: '{{name}}',
        type: 'TEXT',
    },
    {
        name: 'Bio',
        code: '{{name}}',
        value: '{{name}}',
        type: 'TEXT',
    },
];

export const output1 = [
    {
        label: 'Name',
        code: '{{name}}',
        value: '{{name}}',
        key: '0',
    },
    {
        label: 'Email',
        code: '{{name}}',
        value: '{{name}}',
        key: '1',
    },
    {
        label: 'Bio',
        code: '{{name}}',
        value: '{{name}}',
        key: '2',
    },
];

export const input2 = [
    {
        name: 'Name',
        value: '{{name}}',
        code: '{{name}}',
        type: 'TEXT',
    },
    {
        name: 'Email',
        value: '{{name}}',
        code: '{{name}}',
        type: 'TEXT',
    },
    {
        name: 'Bio',
        value: '{{name}}',
        code: '{{name}}',
        type: 'RICH_TEXT',
    },
    {
        name: 'books',
        type: 'SINGLE_REFERENCE',
        codes: [
            {
                name: 'Name',
                code: '{{book.name}}',
                value: '{{book.name}}',
                type: 'TEXT',
            },
            {
                name: 'Title',
                value: '{{book.title}}',
                code: '{{book.title}}',
                type: 'TEXT',
            },
        ],
        refTopic: 'refId',
    },
];

export const output2 = [
    {
        label: 'Name',
        code: '{{name}}',
        value: '{{name}}',
        key: '0',
    },
    {
        label: 'Email',
        value: '{{name}}',
        code: '{{name}}',
        key: '1',
    },
    {
        label: 'Bio',
        value: '{{name}}',
        code: '{{name}}',
        key: '2',
    },
    {
        label: 'books',
        key: '3+refId',
        children: [
            {
                label: 'Name',
                value: '{{book.name}}',
                code: '{{book.name}}',
                key: '3+0',
            },
            {
                label: 'Title',
                value: '{{book.title}}',
                code: '{{book.title}}',
                key: '3+1',
            },
        ],
    },
];

export const input3 = [
    {
        name: 'booksRef',
        type: 'SINGLE_REFERENCE',
        codes: [
            {
                name: 'Name',
                code: '{{book.name}}',
                value: '{{book.name}}',
                type: 'TEXT',
            },
            {
                name: 'Title',
                value: '{{book.title}}',
                code: '{{book.title}}',
                type: 'TEXT',
            },
        ],
        isUninitialized: true,
        refTopic: 'refId',
    },
];
