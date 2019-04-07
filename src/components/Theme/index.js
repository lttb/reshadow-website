import React from 'react';
import {useConfig, ComponentsProvider} from 'docz';
import {components, enhance} from 'docz-theme-default';
import {ThemeProvider} from 'styled-components';
import styled, {css} from 'reshadow';

const styles = css`
    @import url('https://unpkg.com/codemirror@5.42.0/lib/codemirror.css');
    @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600');

    :global(.icon-link) {
        display: none;
    }

    :global(.with-overlay) {
        overflow: hidden;
    }

    :global(body) {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica,
            Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
            'Segoe UI Symbol';
        font-size: 4.5rem;
        line-height: 1.6;
        font-style: normal;
        -webkit-font-smoothing: subpixel-antialiased;
    }

    :global(html),
    :global(body),
    :global(#root) {
        height: auto;
        min-height: 100%;
    }

    :global(html) {
        /* fix scroll for mobiles */
        height: 100vh;
        overflow-y: auto !important;
        font-size: 4px;
    }
`;

const Page = ({children, ...props}) => {
    const {doc} = props;

    React.useEffect(() => {
        if (doc.route === '/') {
            document.title = 'reshadow';
        } else {
            document.title = doc.title ? `reshadow / ${doc.title}` : 'reshadow';
        }

        document.description = doc.description || 'reshadow website';
    }, [doc.title, doc.description]);

    return styled(styles)`
        h1,
        desc {
            color: #fafafae6;
            margin: 0;
        }

        h1 {
            font-size: 13rem;
            line-height: 1.2;
        }

        header,
        article {
            padding: 0 10rem;
        }

        header {
            margin-bottom: 10rem;
            margin-top: 7rem;
        }

        article {
            padding-top: 5rem;
            background: #fafafa;
            min-height: 100%;
            border: 0.5rem solid #087aa0;
            box-shadow: 0px 0px 3rem -1rem white;
            border-radius: 4rem 4rem 0 0;
            min-height: 50vh;
        }

        @media (max-width: 1024px) {
            header,
            article {
                padding: 0 5rem;
            }

            header {
                margin-top: 12rem;
            }

            h1 {
                font-size: 11rem;
            }
        }
    `(
        <components.page {...props}>
            <header>
                <h1>{doc.title}</h1>
                {doc.description && <desc as="p">{doc.description}</desc>}
            </header>
            <article>{children}</article>
        </components.page>,
    );
};

const Theme = ({children}) => {
    const config = useConfig();

    return (
        <ThemeProvider
            theme={prev => ({
                ...prev,
                docz: config.themeConfig,
            })}
        >
            <ComponentsProvider
                components={{
                    ...components,
                    page: Page,
                }}
            >
                {children}
            </ComponentsProvider>
        </ThemeProvider>
    );
};

export default enhance(Theme);
