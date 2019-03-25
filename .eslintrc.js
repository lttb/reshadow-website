module.exports = {
    extends: [
        'standard',
        'plugin:flowtype/recommended',
        'plugin:react/recommended',
        'plugin:prettier/recommended',
        'prettier/flowtype',
        'prettier/react',
        'prettier/standard',
    ],
    plugins: ['flowtype', 'react', 'prettier', 'standard'],
    parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    env: {
        es6: true,
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    overrides: [{
            files: ['**/spec/*.js'],
            env: {
                jest: true,
            },
        },
        {
            files: ['*.config.js', '.*.js'],
            parserOptions: {
                sourceType: 'script',
            },
            env: {
                node: true,
            },
        },
    ],
    rules: {
        'no-sequences': 'off',

        "react/prop-types": ['error', {
            skipUndeclared: true,
        }],
    },
};
