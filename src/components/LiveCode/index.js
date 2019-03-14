import React, {Suspense} from 'react';
import LazyLoad from 'react-lazyload';

const CodeEditor = React.lazy(() =>
    import(/* webpackChunkName: "code-editor" */
    /* webpackPreload: true */
    './CodeEditor'),
);

const LiveCode = props => (
    <LazyLoad height={200} offset={300} once>
        <Suspense fallback={<div>Loading...</div>}>
            <CodeEditor {...props} />
        </Suspense>
    </LazyLoad>
);

export default LiveCode;
