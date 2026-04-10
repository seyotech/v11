var fs = require('fs');

module.exports = {
    input: [
        'src/modules/**/*.{js,jsx}',
        'src/components/editor-resources/**/*.{js}',

        // filter out files or directories
        '!src/modules/**/*.test.{js,jsx}',
        '!src/i18n/**',
        '!**/node_modules/**',
    ],
    output: './',
    options: {
        compatibilityJSON: 'v3',
        debug: true,
        func: {
            list: ['i18next.t', 'i18n.t', 't'],
            extensions: ['.js', '.jsx'],
        },
        lngs: ['en'],
        ns: ['builder'],
        defaultLng: 'en',
        defaultNs: 'builder',
        resource: {
            // the destination path is relative to the current file
            loadPath: 'public/locales/{{lng}}/{{ns}}.json',

            // the destination path is relative to the current file
            savePath: 'public/locales/{{lng}}/{{ns}}.json',
            jsonIndent: 4,
        },
    },
    transform: function customTransform(file, enc, done) {
        'use strict';
        const parser = this.parser;
        const content = fs.readFileSync(file.path, enc);
        let count = 0;

        parser.parseFuncFromString(
            content,
            { list: ['i18next.t', 'i18n.t', 't'] },
            (key, options) => {
                parser.set(
                    key,
                    Object.assign({}, options, {
                        nsSeparator: false,
                        keySeparator: false,
                    })
                );
                ++count;
            }
        );

        done();
    },
};
