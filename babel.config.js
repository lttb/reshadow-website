module.exports = {
    plugins: [
        [require.resolve('reshadow/babel'), {postcss: true}],
        [
            'module-resolver',
            {
                alias: {
                    '@': './src',
                },
            },
        ],
        [
            'prismjs',
            {
                languages: [
                    'javascript',
                    'css',
                    'markup',
                    'jsx',
                    'scss',
                    'sass',
                ],
                theme: 'coy',
                css: true,
            },
        ],
    ],
};
