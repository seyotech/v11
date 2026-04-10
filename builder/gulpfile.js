var gulp = require('gulp');
const path = require('path');
const fs = require('fs-extra');
var scanner = require('i18next-scanner');
const { globSync } = require('glob');
const { I18nKeyCollector } = require('./src/libs/translation/I18nKeyCollector');
// var sass = require('gulp-sass');
// var concat = require('gulp-concat');
// var cleanCSS = require('gulp-clean-css');

// sass.compiler = require('node-sass');

// const sassPaths = [
//     './node_modules/normalize.css/normalize.css',
//     './src/scss/grid.scss',
//     './src/scss/sites.scss',
// ];

// gulp.task('website', function () {
//     return gulp
//         .src(sassPaths)
//         .pipe(sass().on('error', sass.logError))
//         .pipe(cleanCSS())
//         .pipe(concat('main.1.css')) // temp! add css versioning later
//         .pipe(gulp.dest('./public/css'));
// });

// gulp.task('builder_canvas', function () {
//     return gulp
//         .src('./src/scss/builder-canvas.scss')
//         .pipe(sass().on('error', sass.logError))
//         .pipe(cleanCSS())
//         .pipe(concat('builder-canvas.css')) // temp! add css versioning later
//         .pipe(gulp.dest('./public/css'));
// });

// gulp.task('sass', gulp.series('website', 'builder_canvas'));

// gulp.task('sass:watch', function () {
//     gulp.watch(sassPaths, gulp.series('website', 'builder_canvas'));
// });

const i18nextPaths = [
    'src/modules/**/*.{js,jsx}',
    'src/components/editor-resources/**/*.{js,jsx}',
];

const i18nextOptions = {
    debug: true,
    allowDynamicKeys: true,
    defaultNs: 'builder',
    keySeparator: false,
    nsSeparator: false,
    ns: ['builder'],
    lngs: ['en'], // supported languages
    func: {
        list: ['i18next.t', 'i18n.t', 't'],
        extensions: ['.js', '.jsx'],
    },
    resource: {
        loadPath: 'public/locales/{{lng}}/{{ns}}.json',
        savePath: 'public/locales/{{lng}}/{{ns}}.json',
        jsonIndent: 4,
    },
};

gulp.task('i18next', function () {
    return gulp
        .src([
            'src/modules/**/*.{js,jsx}',
            'src/components/editor-resources/**/*.{js,jsx}',
        ])
        .pipe(scanner(i18nextOptions))
        .pipe(gulp.dest('./'));
});

gulp.task('key-collector', function () {
    return gulp
        .src(['src/components/editor-resources/index.js'])
        .pipe(
            scanner(
                { ...i18nextOptions, keySeparator: false, nsSeparator: false },
                function customTransform(_, enc, done) {
                    const resources = globSync(
                        [
                            '**/components/editor-resources/**/!(elements).{js,json}',
                            '**/util/socialOptions.js',
                        ],
                        {
                            ignore: 'node_modules/**',
                        }
                    );

                    const keyCollector = new I18nKeyCollector(this.parser);

                    resources
                        .flatMap((resource) =>
                            fs
                                .readFileSync(resource, enc)
                                .match(keyCollector.getKeyMatcher(resource))
                        )
                        .filter(Boolean)
                        .forEach(keyCollector.setKey);
                    done();
                }
            )
        )
        .pipe(gulp.dest('./'));
});

const copyAssets = () => {
    const sourcePath = path.join(__dirname, 'public/locales/en/');
    const destinationPathStatic = path.join(
        __dirname,
        '../../apps/main-dashboard/public/locales/en/'
    );

    fs.copySync(sourcePath, destinationPathStatic);

    const destinationPathCMS = path.join(
        __dirname,
        '../../apps/cms-dashboard/public/locales/en/'
    );
    fs.copySync(sourcePath, destinationPathCMS);
};

gulp.task('copy-assets', async function (done) {
    copyAssets();
    done();
});

gulp.task('i18next:watch', function () {
    gulp.watch(i18nextPaths, gulp.series('i18next', 'copy-assets'));
});

gulp.task(
    'extract-translation-keys',
    gulp.series('key-collector', 'copy-assets')
);
