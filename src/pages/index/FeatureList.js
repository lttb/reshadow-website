import React from 'react';
import styled from 'reshadow';

const FeatureList = ({render}) => styled`
    featureList {
        position: relative;
        /* display: grid; */
        /* grid-gap: 8rem 3rem; */
        /* grid-template-columns: repeat(auto-fill, minmax(60rem, 1fr)); */
        display: flex;
        flex-direction: column;
        margin: 4rem 0;
        flex: 1;
        min-width: 70rem;
        padding-right: 4rem;
    }

    feature {
        display: flex;
        flex-direction: column;

        & + feature {
            margin-top: 8rem;
        }

        & h3 {
            color: #45717f;
            font-size: 4rem;
            font-weight: 300;
            margin: 0;
            margin-bottom: 2rem;
        }

        & b {
            font-weight: 500;
        }

        & p {
            margin: 0;
        }
    }
`(<featureList>{render(styled.styles)}</featureList>);

export default FeatureList;
