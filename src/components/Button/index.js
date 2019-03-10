import React from 'react';
import styled from 'reshadow';
import {readableColor, rgba} from 'polished';

const Button = ({bgcolor = 'lightgray', size = 's', children, ...props}) =>
    styled`
        button {
            cursor: pointer;
            padding: 5px 10px;
            border-radius: 5px;
            border: 2px solid ${bgcolor};
            background-color: ${rgba(bgcolor, 0.7)};
            color: ${readableColor(bgcolor)};
            transition: background-color .5s;

            &:hover {
                background-color: ${rgba(bgcolor, 0.9)};
            }
        }

        /**
        * Match on the 'disabled' prop,
        * not the DOM attribute
        **/
        button[disabled] {
            opacity: .5;
            pointer-events: none;
        }

        /**
        * Match on the 'use:size' prop
        */
        button[use|size="s"] {
            font-size: 12px;
        }

        /* The 'use' namespace can be omitted */
        button[|size="m"] {
            font-size: 14px;
        }
    `(
        /* use:size property would not pass to the DOM */
        <button {...props} use:size={size}>
            {children}
        </button>,
    );

export default Button;
