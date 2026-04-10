import react from '@vitejs/plugin-react';
import fs from 'fs/promises';
import { resolve } from 'node:path';
import * as path from 'path';
import scss from 'rollup-plugin-scss';
import { defineConfig } from 'vite';
// import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
    // const env = loadEnv(mode, process.cwd());

    return {
        plugins: [
            react({
                babel: {
                    plugins: ['macros'],
                },
            }),
            // visualizer({
            //     filename: './dist/stats.html',
            // }),
        ],
        esbuild: {
            loader: 'jsx',
            include: /src\/.*\.jsx?$/,
            exclude: [],
        },
        optimizeDeps: {
            esbuildOptions: {
                plugins: [
                    {
                        name: 'load-js-files-as-jsx',
                        setup(build) {
                            build.onLoad(
                                { filter: /src\/.*\.js$/ },
                                async (args) => ({
                                    loader: 'jsx',
                                    contents: await fs.readFile(
                                        args.path,
                                        'utf8'
                                    ),
                                })
                            );
                        },
                    },
                ],
            },
        },
        build: {
            minify: mode === 'development' ? false : true,
            sourcemap: true,
            emptyOutDir: false,
            lib: {
                entry: resolve('src', 'index.js'),
                name: '@dorik/builder',
                formats: ['es', 'cjs'],
                fileName: (format) => `index.${format}.js`,
            },
            rollupOptions: {
                external: [
                    'react',
                    'react-dom',
                    'handlebars',
                    'dayjs',
                    'antd',
                    '@ant-design/cssinjs',
                    'styled-components',
                    '@sentry/react',
                    '@dorik/html-parser',
                    '@dorik/style-generator',
                    '@fortawesome/react-fontawesome',
                    '@fortawesome/fontawesome-svg-core',
                    '@fortawesome/pro-duotone-svg-icons',
                    '@fortawesome/pro-light-svg-icons',
                    '@fortawesome/pro-regular-svg-icons',
                    '@fortawesome/pro-solid-svg-icons',
                    '@fortawesome/free-regular-svg-icons',
                    '@fortawesome/free-solid-svg-icons',
                    '@fortawesome/free-brands-svg-icons',
                    'i18next-browser-languagedetector',
                ],
                plugins: [
                    scss({
                        include: [
                            'src/**/*.css',
                            'src/**/*.scss',
                            'src/**/*.sass',
                        ],
                        output: 'dist/css/style.css',
                    }),
                ],
            },
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                components: path.resolve(__dirname, './src/components'),
                contexts: path.resolve(__dirname, './src/contexts'),
                constants: path.resolve(__dirname, './src/constants'),
                hoc: path.resolve(__dirname, './src/hoc'),
                hooks: path.resolve(__dirname, './src/hooks'),
                libs: path.resolve(__dirname, './src/libs'),
                modules: path.resolve(__dirname, './src/modules'),
                scss: path.resolve(__dirname, './src/scss'),
                util: path.resolve(__dirname, './src/util/'),
            },
        },
        test: {
            retry: 3,
            globals: true,
            testTimeout: 30000,
            environment: 'jsdom',
            setupFiles: ['./src/util/test-utils.js'],
            coverage: {
                enabled: true,
            },
        },
    };
});
