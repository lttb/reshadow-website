import React, {Suspense} from 'react';
import LazyLoad from 'react-lazyload';

import styled from 'reshadow';

const CodeEditor = React.lazy(() =>
    import(/* webpackChunkName: "code-editor" */
    /* webpackPreload: true */
    './CodeEditor'),
);

const LiveCode = props => (
    <LazyLoad height={200} offset={300} once>
        <Suspense
            fallback={styled`
                loading {
                    width: 100%;
                    height: 200px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 32px;
                    color: #008ebd;
                }
            `(<loading>Loading Playground...</loading>)}
        >
            <CodeEditor {...props} />
        </Suspense>
    </LazyLoad>
);

export default LiveCode;
