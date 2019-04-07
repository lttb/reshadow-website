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
    theme: require.resolve('./src/components/Theme'),
    public: './src/public',
    htmlContext: {
        favicon: '/public/favicon/favicon.ico',
    },
    themeConfig: {
        colors: {
            primary: '#097aa0',
            background: '#fafafa',
            link: '#008ebd',
            text: '#1D2330',
            sidebarBg: '#fffffff0',
            sidebarText: '#222',
        },
        styles: {
            code: css`
                border: 0.25rem solid rgba(0, 0, 0, 0.02);
                font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo,
                    Courier, monospace;
            `,
            pre: css`
                font-size: 3.5rem !important;
                font-family: 'Fira code', 'Fira Mono', monospace;
            `,
            container: css`
                padding: 0 !important;
                width: 100%;

                @media (min-width: 1024px) {
                    max-width: 1024px;
                }

                & > a {
                    border-radius: 3rem;
                    background: white;

                    @media (min-width: 920px) {
                        right: 80px;
                    }
                }
            `,
            sidebar: css`
                box-shadow: 0px 0px 3rem -1rem;

                /* a trick to set background for the page */
                & ~ div {
                    min-height: 100vh;
                    background-image: linear-gradient(
                        to right top,
                        #051937,
                        #133f5f,
                        #296986,
                        #4996aa,
                        #72c5cb
                    );

                    &:last-child {
                        z-index: 1;
                    }
                }

                /* hide main page */
                & nav > div:first-child {
                    display: none;
                }

                /* style the Hamburger */
                & > div > button {
                    background: none;
                    top: 0px;
                    right: -40px;
                    padding-top: 10px;
                }
            `,
            ul: css`
                padding: 0;

                & li::before {
                    content: '●';
                    font-size: 0.6em;
                    margin-right: 3rem;
                    vertical-align: middle;
                    display: inline-block;
                    margin-bottom: 1rem;
                }

                & & li::before {
                    content: '○ ';
                }
            `,
        },
    },
    menu: ['reshadow', 'motivation', 'concepts', 'usage', 'advanced', 'setup'],
    plugins: [
        cssPlugin({
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
