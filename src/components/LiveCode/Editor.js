// @flow

import React, {Component} from 'react';
import {Editor as BaseEditor} from 'react-live';
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
            root {
                max-height: ${maxHeight};
                overflow: scroll;
                background: #f6f8fa;
                padding: 5px 10px;
                box-shadow: inset 0px 0px 10px -9px;

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
                }}
        `(
            <root>
                {path && <path>{path}</path>}
                <BaseEditor
                    language={language}
                    theme={undefined}
                    code={codeBlock(file)}
                    onChange={onChange}
                />
            </root>,
        );
    }
}
