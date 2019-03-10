const {css} = require('docz-plugin-css');

module.exports = {
    title: 'reshadow ⛱️',
    description: 'reshadow documentation',
    hashRouter: true,
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
    plugins: [
        css({
            preprocessor: 'postcss',
        }),
    ],
    modifyBabelRc: babelrc => {
        // babelrc.plugins.push([
        //     require.resolve('reshadow/babel'),
        //     {postcss: true, files: /\.css$/},
        // ]);

        console.log(babelrc);
        return babelrc;
    },
};
