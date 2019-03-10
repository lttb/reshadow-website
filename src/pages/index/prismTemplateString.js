import Prism from 'prismjs';

const {languages} = Prism;

console.log(languages);

// NOTE: This highlights template-strings as strings of CSS
Prism.languages.insertBefore('jsx', 'template-string', {
    'styled-template-string': {
        pattern: /(styled|css)`(?:\$\{[^}]+\}|\\\\|\\?[^\\])*?`/,
        lookbehind: true,
        greedy: true,
        inside: {
            interpolation: {
                pattern: /\$\{[^}]+\}/,
                inside: {
                    'interpolation-punctuation': {
                        pattern: /^\$\{|\}$/,
                        alias: 'punctuation',
                    },
                    rest: languages.jsx,
                },
            },
            attr: {
                pattern: /\[.*?\]/,
            },
            string: {
                pattern: /(.|[\r\n])*/,
                inside: languages.scss,
                alias: 'language-scss',
            },
        },
    },
});
