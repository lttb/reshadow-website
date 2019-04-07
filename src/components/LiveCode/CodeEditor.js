import React from 'react';
import styled from 'reshadow';

import Editor from './Editor';
import Preview from './CodePreview';

import './prismTemplateString';

let index = 0;

const CodeEditor = ({
    children,
    direction,
    filename,
    maxHeight = '350px',
    options = {},
}) => {
    const {code, files = {}, parts = {}} = children;

    const [scripts, setScripts] = React.useState(code);
    const [scriptFiles, setScriptFiles] = React.useState(files);

    const ref = React.useRef({});

    if (!ref.current.hash) {
        ref.current.hash = ++index;
    }

    return styled`
        root {
            display: flex;
            border: 1rem solid #f0f4f6;
            border-radius: 3rem;
            flex-wrap: wrap;
            margin: 7rem 0;
            overflow: hidden;

            &[|direction='column'] {
                flex-direction: column;
            }
        }

        editor {
            flex: 1;
            font-size: 3rem;
            max-width: 100%;
            background: #f0f4f6;

            & html|pre {
                margin: 0;

                &:focus {
                    outline: none;
                }
            }
        }
    `(
        <root use:direction={direction}>
            <editor>
                {Object.keys(scriptFiles).map(path => (
                    <Editor
                        key={path}
                        language="scss"
                        path={path}
                        file={scriptFiles[path]}
                        maxHeight={maxHeight}
                        onChange={freshFile => {
                            setScriptFiles(oldFiles => ({
                                ...oldFiles,
                                [path]: freshFile,
                            }));
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
                                onChange={freshScript => {
                                    setScripts(oldScripts =>
                                        Object.assign([...oldScripts], {
                                            [scriptIndex]: freshScript,
                                        }),
                                    );
                                }}
                            />
                        ),
                )}
            </editor>

            <Preview
                code={scripts.join('\n')}
                files={scriptFiles}
                filename={filename + ref.current.hash}
                options={options}
            />
        </root>,
    );
};

export default CodeEditor;
