// @flow

import React, {Component} from 'react';
import Prism from 'prismjs';
import BaseEditor from 'react-simple-code-editor';
import {codeBlock} from 'common-tags';
import styled from 'reshadow';

type Props = {
    file: string,
    language: 'jsx' | 'scss',
    maxHeight: string,
    path: string,
    onChange: () => void,
};

export default class Editor extends Component<Props> {
    shouldComponentUpdate(nextProps: Props) {
        return this.props.file !== nextProps.file;
    }

    render() {
        const {file, language, maxHeight, path, onChange} = this.props;
        return styled`
            :global(.token.operator) {
                background: none !important;
            }

            root {
                max-height: ${maxHeight};
                overflow: scroll;
                background: #f6f8fa;
                padding: 5px 10px;
                box-shadow: inset 0px 0px 10px -9px;
                transition: background 0.3s;

                &:focus-within {
                    background: white;
                }

                & + root {
                    margin-top: 10px;
                }

                & path {
                    font-weight: bold;
                    padding: 0;
                    float: right;
                    font-size: 13px;
                    color: #29687d;
                    position: sticky;
                    top: 0;
                    right: 10px;
                }

                & :global(textarea):focus {
                    outline: none;
                }
            }
        `(
            <root>
                {path && <path>{path}</path>}
                <BaseEditor
                    highlight={code => (
                        <div
                            style={{whiteSpace: 'pre'}}
                            dangerouslySetInnerHTML={{
                                __html: Prism.highlight(
                                    code,
                                    Prism.languages[language],
                                ),
                            }}
                        />
                    )}
                    value={codeBlock(file)}
                    onValueChange={onChange}
                    style={{
                        fontFamily: '"Fira code", "Fira Mono", monospace',
                        fontSize: 12,
                    }}
                />
            </root>,
        );
    }
}
