import fs from 'fs';
import React from 'react';
import {registerPlugin, registerPreset, transform} from '@babel/standalone';
import presetReact from '@babel/preset-react';
import reshadowBabel from 'reshadow/babel';
import transformModles from '@babel/plugin-transform-modules-commonjs';

import styled from 'reshadow';

import Editor from './Editor';

import './prismTemplateString';

/**
 * Mocks for the postcss-import-sync2
 */
fs.stat = () => '';
fs.readFile = () => '';

registerPlugin('reshadow/babel', reshadowBabel);
registerPlugin('@babel/plugin-transform-modules-commonjs', transformModles);
registerPreset('@babel/preset-react', presetReact);

const getOptions = options => ({
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

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    componentDidCatch(error, info) {
        console.error('Error was catched inside the component', error, info);
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

const CodeEditor = ({
    children,
    direction,
    filename,
    maxHeight = '350px',
    options,
}) => {
    const React = require('react');
    const resolve = require('resolve');

    const [scripts, setScripts] = React.useState(children.code);
    const ref = React.useRef({});

    if (!ref.current.hash) {
        ref.current.hash = ++index;
    }

    const {files = {}} = children;

    const transpile = data => {
        if (children.files) {
            resolve.sync = file => file;
            fs.readFileSync = path => files[path];
        }

        let res = null;

        try {
            const {code} = transform(`import styled from 'reshadow';` + data, {
                ...getOptions(options),
                filename: filename + ref.current.hash,
            });

            res = code;
        } catch (e) {
            console.error(e);
        }

        return res;
    };

    let element = null;

    try {
        // We definitely need to do `eval` here
        // eslint-disable-next-line no-eval
        element = eval(transpile(scripts.join('\n')));
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
            margin: 28px 0;

            &[|direction='column'] {
                flex-direction: column;
            }
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

        preview {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0px 10px 10px 0px;
            padding: 25px 30px;
        }
    `(
        <root use:direction={direction}>
            <editor>
                {Object.keys(files).map(path => (
                    <Editor
                        key={path}
                        language="scss"
                        path={path}
                        file={files[path]}
                        maxHeight={maxHeight}
                        onChange={freshFile => {
                            files[path] = freshFile;

                            setScripts(scripts => [...scripts]); // Triggers rerender
                        }}
                    />
                ))}
                {scripts.map(
                    (script, scriptIndex) =>
                        !(parts[scriptIndex] && parts[scriptIndex].hidden) && (
                            <Editor
                                key={scriptIndex}
                                language="jsx"
                                file={script}
                                maxHeight={maxHeight}
                                onChange={freshScript =>
                                    setScripts(oldScripts =>
                                        Object.assign([...oldScripts], {
                                            [scriptIndex]: freshScript,
                                        }),
                                    )
                                }
                            />
                        ),
                )}
            </editor>
            <ErrorBoundary key={Math.random()}>
                <preview>{element}</preview>
            </ErrorBoundary>
        </root>,
    );
};

export default CodeEditor;
