const {css} = require('docz-plugin-css');

module.exports = {
    title: 'reshadow ⛱️',
    description: 'reshadow documentation',
    dest: '/dist',
    hashRouter: true,
    repository: 'https://github.com/lttb/reshadow',
    editBranch: 'feature/initial',
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
        },
    },
    menu: ['reshadow', 'usage', 'setup', 'linting'],
    plugins: [
        css({
            preprocessor: 'postcss',
        }),
    ],
};
