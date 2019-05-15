import fs from 'fs';
import resolve from 'resolve';

import {registerPlugin, registerPreset, transform} from '@babel/standalone';
import presetReact from '@babel/preset-react';
import reshadowBabel from 'reshadow/babel';
import transformModules from '@babel/plugin-transform-modules-commonjs';

/**
 * Mocks for the postcss-import-sync2
 */
fs.stat = () => '';
fs.readFile = () => '';

/* mock file resolvers */
resolve.sync = file => file;

registerPlugin('reshadow/babel', reshadowBabel);
registerPlugin('@babel/plugin-transform-modules-commonjs', transformModules);
registerPreset('@babel/preset-react', presetReact);

const getOptions = (options = {}) => ({
    root: __dirname,
    filename: __filename,
    presets: [
        [
            '@babel/preset-react',
            {
                throwIfNamespace: false,
                useBuiltIns: true,
            },
        ],
    ],
    plugins: [
        [
            'reshadow/babel',
            {
                postcss: true,
                files: /\.css$/,
                ...options.reshadow,
            },
        ],
        '@babel/plugin-transform-modules-commonjs',
    ],
});

window.require = function(module) {
    switch (module) {
        case 'polished':
            return require('polished');
        case 'reshadow':
            return require('reshadow');
        case 'react':
            return require('react');
        case '@reshadow/core':
            return require('@reshadow/core');
    }
};

const evalCode = async (source, readFile, {filename, ...options}) => {
    fs.readFileSync = readFile;

    const {code} = await transform(source, {
        ...getOptions(options),
        filename,
    });

    // We definitely need to do `eval` here
    // eslint-disable-next-line no-eval
    const result = eval(code);

    return result;
};

export default evalCode;
