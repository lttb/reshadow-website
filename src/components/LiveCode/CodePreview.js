import React from 'react';
import styled from 'reshadow';

import {debounce} from 'lodash';
import {codeBlock} from 'common-tags';

import evalCode from './evalCode';

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

const createRenderer = ({setElement, setError}) => (
    scripts,
    files,
    options,
) => {
    const readFile = path => files[path];

    const chunks = scripts
        .slice(0, -1)
        .map(codeBlock)
        .join('\n');
    const [render] = scripts.slice(-1);

    const source = codeBlock`
        import React from 'react';
        import styled from 'reshadow';
        ${chunks};
        <>
            ${render}
        </>
    `;

    return evalCode(source, readFile, options)
        .then(setElement)
        .catch(setError);
};

const Preview = ({scripts, files, filename, options}) => {
    const [state, setState] = React.useState({element: null});

    const setElement = element => setState({element});
    const setError = error => setState(x => ({...x, error}));

    const renderElement = React.useMemo(
        () =>
            debounce(
                createRenderer({
                    setElement,
                    setError,
                }),
                200,
            ),
        [],
    );

    React.useEffect(() => {
        renderElement(scripts, files, {
            ...options,
            filename,
        });

        if (!state.element) {
            renderElement.flush();
        }
    }, [scripts, files]);

    return styled`
        preview {
            position: relative;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-around;
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
    ({scripts, files}, next) =>
        scripts === next.scripts && files === next.files,
);
