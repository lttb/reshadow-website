const webpack = require('webpack');
const {css: cssPlugin} = require('docz-plugin-css');
const {css} = require('styled-components');

module.exports = {
    title: 'reshadow ⛱️',
    description: 'reshadow documentation',
    files: './src/pages/**/*.mdx',
    dest: '/dist',
    repository: 'https://github.com/lttb/reshadow',
    editBranch: 'master',
    themeConfig: {
        colors: {
            primary: '#097aa0',
            background: '#fafafa',
            text: '#1D2330',
            sidebarBg: '#fffffff0',
            sidebarText: '#222',
        },
        styles: {
            body: css`
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                    Helvetica, Arial, sans-serif, 'Apple Color Emoji',
                    'Segoe UI Emoji', 'Segoe UI Symbol';
                font-size: 18px !important;
                line-height: 1.6;
                font-style: normal;
                -webkit-font-smoothing: subpixel-antialiased;
            `,
            code: css`
                border: 1px solid rgba(0, 0, 0, 0.02);
                font-family: 'Inconsolata', monospace;
            `,
            pre: css`
                font-size: 12px !important;
                font-family: 'Fira code', 'Fira Mono', monospace;
            `,
            container: css`
                background: #fafafa;
                min-height: 100%;
                border: 2px solid #087aa0;
                box-shadow: 0px 0px 10px -5px white;

                @media (min-width: 1024px) {
                    width: 1024px;
                }

                & > a {
                    border-radius: 12px;
                    background: white;

                    @media (min-width: 920px) {
                        right: 80px;
                    }
                }
            `,
            sidebar: css`
                box-shadow: 0px 0px 10px -5px;

                /* a trick to set background for the page */
                & ~ div {
                    background-image: linear-gradient(
                        to right top,
                        #051937,
                        #133f5f,
                        #296986,
                        #4996aa,
                        #72c5cb
                    );
                }
            `,
            ul: css`
                padding: 0;

                & & li::before {
                    content: '○ ';
                }
            `,
        },
    },
    menu: ['reshadow', 'getting started', 'usage', 'setup', 'linting'],
    plugins: [
        cssPlugin({
            preprocessor: 'postcss',
        }),
    ],
    modifyBundlerConfig(config, dev) {
        config.plugins.push(
            // new webpack.IgnorePlugin({
            //     resourceRegExp: /^module$/,
            // }),

            new webpack.NormalModuleReplacementPlugin(
                /^buble/,
                require.resolve('./configs/stubs/buble.js'),
            ),

            new webpack.NormalModuleReplacementPlugin(
                /(^cssnano)/,
                require.resolve('./configs/stubs/postcss-plugin.js'),
            ),
        );

        // config.module.rules.push({
        //     test: /\.js$/,
        //     type: 'javascript/auto',
        // });

        console.log(config.module.rules);

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
