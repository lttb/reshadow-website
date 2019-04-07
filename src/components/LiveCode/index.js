import React, {Suspense} from 'react';
import LazyLoad from 'react-lazyload';

import styled from 'reshadow';

const CodeEditor = React.lazy(() =>
    import(/* webpackChunkName: "code-editor" */
    /* webpackPreload: true */
    './CodeEditor'),
);

const LiveCode = props => (
    <LazyLoad height={200} offset={200} once>
        <Suspense
            fallback={styled`
                loading {
                    width: 100%;
                    height: 50rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 8rem;
                    color: #008ebd;
                }
            `(<loading>Loading Playground...</loading>)}
        >
            <CodeEditor {...props} />
        </Suspense>
    </LazyLoad>
);

export default LiveCode;
