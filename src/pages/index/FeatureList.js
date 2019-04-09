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
        margin: 2rem 0;
        flex: 1;
        min-width: 280px;
        padding-right: 4rem;
    }

    feature {
        display: flex;
        flex-direction: column;

        & + feature {
            margin-top: 4rem;
        }

        & h3 {
            color: #4a9bb7;
            font-size: 5rem;
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
