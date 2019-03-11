import fs from 'fs';
import React from 'react';
import * as Babel from '@babel/standalone';
import presetReact from '@babel/preset-react';
import reshadowBabel from 'reshadow/babel';
import transformModles from '@babel/plugin-transform-modules-commonjs';

import styled from 'reshadow';

import {codeBlock} from 'common-tags';
import {Editor} from 'react-live';
import LazyLoad from 'react-lazyload';

import './prismTemplateString';

/**
 * Mocks for the postcss-import-sync2
 */
fs.stat = () => '';
fs.readFile = () => '';

Babel.registerPlugin('reshadow/babel', reshadowBabel);
Babel.registerPlugin(
    '@babel/plugin-transform-modules-commonjs',
    transformModles,
);
Babel.registerPreset('@babel/preset-react', presetReact);

const defaultOptions = {
    root: __dirname,
    filename: __filename,
    presets: [
        ['@babel/preset-react', {throwIfNamespace: false, useBuiltIns: true}],
    ],
    plugins: [
        ['reshadow/babel', {postcss: true, files: /\.css$/}],
        '@babel/plugin-transform-modules-commonjs',
    ],
};

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({hasError: true});
    }

    render() {
        if (this.state.hasError) {
            return 'errors';
        }

        return this.props.children;
    }
}

let index = 0;

window.require = function(module) {
    switch (module) {
        case 'polished':
            return require('polished');
        case 'reshadow':
            return require('reshadow');
    }
};

const CodeEditor = ({children, filename, maxHeight = '200px'}) => {
    const React = require('react');
    const polished = require('polished');
    const resolve = require('resolve');

    const [state, setState] = React.useState(children.code);
    const ref = React.useRef({});

    if (!ref.current.hash) {
        ref.current.hash = ++index;
    }

    const {files = {}} = children;

    const transpile = data => {
        if (children.files) {
            resolve.sync = file => file;
            fs.readFileSync = file => files[file];
        }

        let res = null;

        try {
            const {code} = Babel.transform(
                `import styled from 'reshadow';` + data,
                {
                    ...defaultOptions,
                    filename: filename + ref.current.hash,
                },
            );

            res = code;
        } catch (e) {
            console.error(e);
        }

        return res;
    };

    let element = null;

    try {
        element = eval(transpile(state.join('\n')));
    } catch (e) {
        console.error(e);
    }

    const {parts = {}} = children;

    return styled`
        root {
            display: flex;
            border: 4px solid #f0f4f6;
            border-radius: 10px;
            flex-wrap: wrap;
        }

        editor {
            flex: 1;
            font-size: 12px;
            max-width: 100%;

            & html|pre {
                margin: 0;

                &:focus {
                    outline: none;
                }
            }
        }

        part {
            max-height: ${maxHeight};
            overflow: scroll;
            background: #f6f8fa;
            padding: 5px 10px;
            box-shadow: inset 0px 0px 10px -9px;

            & + part {
                margin-top: 10px;
            }

            & filename {
                font-weight: bold;
                padding: 0;
                float: right;
                font-size: 13px;
                color: #29687d;
                position: sticky;
                top: 0;
                right: 10px;
            }
        }

        preview {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0px 10px 10px 0px;
            padding: 25px 30px;
        }
    `(
        <root>
            <editor>
                {Object.keys(files).map(key => (
                    <part key={key}>
                        <filename>{key}</filename>
                        <Editor
                            language="scss"
                            theme={undefined}
                            code={codeBlock(files[key])}
                            onChange={code => {
                                files[key] = code;

                                setState(st => [...st]);
                            }}
                        />
                    </part>
                ))}
                {state.map(
                    (x, i) =>
                        !(parts[i] && parts[i].hidden) && (
                            <part key={i}>
                                <Editor
                                    language="jsx"
                                    theme={undefined}
                                    code={codeBlock(x)}
                                    onChange={code =>
                                        setState(st =>
                                            Object.assign([...st], {
                                                [i]: code,
                                            }),
                                        )
                                    }
                                />
                            </part>
                        ),
                )}
            </editor>
            <ErrorBoundary key={Math.random()}>
                <preview>{element}</preview>
            </ErrorBoundary>
        </root>,
    );
};

export default props => (
    <LazyLoad height={200} offset={100} once>
        <CodeEditor {...props} />
    </LazyLoad>
);
