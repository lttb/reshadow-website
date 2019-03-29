const webpack = require('webpack');
const {css} = require('docz-plugin-css');

module.exports = {
    title: 'reshadow ⛱️',
    description: 'reshadow documentation',
    src: './src',
    files: 'pages/**/*.mdx',
    dest: '/dist',
    repository: 'https://github.com/lttb/reshadow',
    editBranch: 'master',
    themeConfig: {
        colors: {
            primary: '#1990b8',
            background: '#fafafa',
            text: '#1D2330',
            sidebarBg: '#fff',
            sidebarText: '#222',
        },
        styles: {
            sidebar: {
                boxShadow: '0px 0px 10px -5px',
            },
            playground: {
                background: '#fafafa',
            },
            ul: {
                '& &': {
                    marginLeft: 25,

                    '& li': {
                        '&::before': {
                            content: '"○ "',
                        },
                    },
                },
            },
        },
    },
    menu: ['reshadow', 'getting started', 'usage', 'setup', 'linting'],
    plugins: [
        css({
            preprocessor: 'postcss',
        }),
    ],
    modifyBundlerConfig(config, dev) {
        config.plugins.push(
            new webpack.IgnorePlugin({
                resourceRegExp: /^module$/,
            }),

            new webpack.NormalModuleReplacementPlugin(
                /^buble/,
                require.resolve('./configs/stubs/buble.js'),
            ),

            new webpack.NormalModuleReplacementPlugin(
                /(^cssnano)/,
                require.resolve('./configs/stubs/postcss-plugin.js'),
            ),
        );

        /* resolve only browser and main fields */
        config.resolve.mainFields = ['browser', 'main'];

        /* ignore context warnings */
        config.module.exprContextCritical = false;

        if (!dev) {
            const utilsIndex = config.entry.app.findIndex(x =>
                x.endsWith('react-dev-utils/webpackHotDevClient.js'),
            );
            config.entry.app.splice(utilsIndex, 1);

            config.optimization.splitChunks = {
                chunks: 'all',
            };
            config.plugins.push(
                new webpack.IgnorePlugin({
                    resourceRegExp: /react-dev-utils/,
                }),
                new webpack.IgnorePlugin({
                    resourceRegExp: /sockjs-client/,
                }),
                new webpack.IgnorePlugin({
                    resourceRegExp: /react-error-overlay/,
                }),
                // new webpack.NormalModuleReplacementPlugin(
                //     /^codemirror/,
                //     require.resolve('./configs/stub.js'),
                // ),
                // new webpack.NormalModuleReplacementPlugin(
                //     /^react-codemirror2/,
                //     require.resolve('./configs/stub.js'),
                // ),
            );
        }

        return config;
    },
};
