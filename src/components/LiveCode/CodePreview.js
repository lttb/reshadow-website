import React from 'react';
import styled from 'reshadow';

import fs from 'fs';
import {registerPlugin, registerPreset, transform} from '@babel/standalone';
import presetReact from '@babel/preset-react';
import reshadowBabel from 'reshadow/babel';
import transformModles from '@babel/plugin-transform-modules-commonjs';

import {debounce} from 'lodash';

/**
 * Mocks for the postcss-import-sync2
 */
fs.stat = () => '';
fs.readFile = () => '';

registerPlugin('reshadow/babel', reshadowBabel);
registerPlugin('@babel/plugin-transform-modules-commonjs', transformModles);
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

const evalCode = async (data, {filename, ...options}) => {
    const {code} = await transform(
        `
                import React from 'react';
                import styled from 'reshadow';
                ${data}
            `,
        {
            ...getOptions(options),
            filename,
        },
    );

    // We definitely need to do `eval` here
    // eslint-disable-next-line no-eval
    return eval(code);
};

class ErrorBoundary extends React.Component {
    state = {
        error: null,
        children: this.props.children,
    };

    stack = [];

    componentDidCatch(error, info) {
        console.error('Error was catched inside the component', error, info);
        this.stack.pop();
        // Display fallback UI
        this.setState({error});
    }

    static getDerivedStateFromProps(props, state) {
        if (props.children === state.children) {
            return null;
        }

        return {
            children: props.children,
            error: null,
        };
    }

    render() {
        const error = this.state.error || this.props.error;

        if (error) {
            const element = this.stack[this.stack.length - 1];
            return styled`
                error {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(234, 100, 100, 0.9);
                    padding: 3rem;
                    box-sizing: border-box;
                    color: white;
                    white-space: pre-wrap;
                    overflow: auto;
                    font-family: monospace;
                    font-size: 14px;
                }
            `(
                <>
                    {element}
                    <error>{error.toString()}</error>
                </>,
            );
        }

        this.stack = [...this.stack.slice(-1), this.props.children];

        return this.props.children;
    }
}

window.require = function(module) {
    switch (module) {
        case 'polished':
            return require('polished');
        case 'reshadow':
            return require('reshadow');
        case 'react':
            return require('react');
    }
};

const Preview = ({code, files, filename, options}) => {
    const [state, setState] = React.useState({element: null});

    const setElement = element => setState({element});
    const setError = error => setState(x => ({...x, error}));

    const renderElement = React.useMemo(
        () =>
            debounce((code, files, options) => {
                /* mock file resolvers */
                const resolve = require('resolve');
                resolve.sync = file => file;
                fs.readFileSync = path => files[path];

                return evalCode(code, options)
                    .then(setElement)
                    .catch(setError);
            }, 200),
        [],
    );

    React.useEffect(() => {
        renderElement(code, files, {
            ...options,
            filename,
        });

        if (!state.element) {
            renderElement.flush();
        }
    }, [code, files]);

    return styled`
        preview {
            position: relative;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0px 3rem 3rem 0px;
            padding: 6rem 7rem;
        }
    `(
        <preview>
            <ErrorBoundary error={state.error}>{state.element}</ErrorBoundary>
        </preview>,
    );
};

export default React.memo(
    Preview,
    ({code, files}, next) => code === next.code && files === next.files,
);
