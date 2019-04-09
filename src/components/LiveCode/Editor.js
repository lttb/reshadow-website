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

    onChange = this.props.onChange;

    render() {
        const {file, language, maxHeight, path} = this.props;

        return styled`
            :global(.token.operator) {
                background: none !important;
            }

            root {
                max-height: ${maxHeight};
                overflow: scroll;
                background: #f6f8fa;
                padding: 1rem 3rem;
                box-shadow: inset 0px 0px 3rem -2.5rem;
                transition: background 0.3s;

                &:focus-within {
                    background: white;
                }

                & + root {
                    margin-top: 3rem;
                }

                & path {
                    font-weight: bold;
                    padding: 0;
                    float: right;
                    font-size: 3rem;
                    color: #29687d;
                    position: sticky;
                    top: 0;
                    right: 2rem;
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
                    onValueChange={this.onChange}
                    style={{
                        fontFamily: '"Fira code", "Fira Mono", monospace',
                        fontSize: '3.5rem',
                        overflow: 'auto',
                    }}
                />
            </root>,
        );
    }
}
