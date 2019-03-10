import fs from 'fs';
import React from 'react';
import * as Babel from '@babel/standalone';
import presetReact from '@babel/preset-react';
import reshadowBabel from 'reshadow/babel';
import transformModles from '@babel/plugin-transform-modules-commonjs';

import styled from 'reshadow';

import {codeBlock} from 'common-tags';
import {Editor} from 'react-live';

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
        ['reshadow/babel', {postcss: true}],
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

const PG = ({children, filename, maxHeight = '200px'}) => {
    window.require = function(module) {
        switch (module) {
            case 'polished':
                return require('polished');
            case 'reshadow':
                return require('reshadow');
        }
    };

    const React = require('react');
    const polished = require('polished');

    const [state, setState] = React.useState(children.code);
    const ref = React.useRef({});

    if (!ref.current.hash) {
        ref.current.hash = ++index;
    }

    const transpile = data => {
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

        console.log({res});

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

export default PG;
