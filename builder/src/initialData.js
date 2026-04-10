import defaultFonts from './util/defaultFonts';

const initialData = {
    pages: [
        {
            data: { content: [] },
            type: 'INDEX',
            name: 'Home',
            slug: 'index',
            isModified: true,
        },
    ],
    global: {
        version: '2.0.0',
        style: {
            fontSize: '16px',
            lineHeight: '1.5',
        },
        heading: {
            h1: {
                style: {
                    fontSize: '48px',
                    lineHeight: '1.5',
                },
            },
            h2: {
                style: {
                    fontSize: '36px',
                    lineHeight: '1.5',
                },
            },
            h3: {
                style: {
                    fontSize: '30px',
                    lineHeight: '1.5',
                },
            },
            h4: {
                style: {
                    fontSize: '24px',
                    lineHeight: '1.5',
                },
            },
            h5: {
                style: {
                    fontSize: '20px',
                    lineHeight: '1.5',
                },
            },
            h6: {
                style: {
                    fontSize: '16px',
                    lineHeight: '1.5',
                },
            },
        },
        tags: {
            a: {
                style: { _textDecoration: 'underline' },
            },
        },
        settings: {
            colors: [],
            defaultFonts,
        },
    },
};

export default initialData;
