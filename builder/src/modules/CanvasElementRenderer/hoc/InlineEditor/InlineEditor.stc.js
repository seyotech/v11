import styled from 'styled-components';

export const InlineEditorStc = styled.div`
    // control styles
    .tukdd6b {
        position: absolute;
        background: #fff;
        z-index: 9999999;
        box-sizing: border-box;
        border-radius: 3px;
        display: flex;
    }
    .tukdd6b.visible {
        visibility: visible !important;
        transform: translate(-50%) scale(1) !important;
    }
    .tukdd6b:after,
    .tukdd6b:before {
        width: 0;
        height: 0;
        left: 50%;
        top: 100%;
        content: ' ';
        position: absolute;
        pointer-events: none;
        border: solid transparent;
    }
    .tukdd6b:after,
    .tukdd6b:before {
        border-width: 4px;
        margin-left: -4px;
        border-top-color: #2b3556;
    }

    // button wrapper styles
    .bpsgbes {
        line-height: 1;
        display: inline-flex;
    }

    .bpsgbes:first-child {
        border-radius: 3px 0 0 3px;
    }
    .bpsgbes:last-child {
        border-radius: 0 3px 3px 0;
    }

    // button styles
    &&& .b181v2oy {
        border: none;
        font-size: 16px;
        padding: 2px 3px;
        font-weight: 600;
        margin-top: unset;
        background: #2b3556;
        place-items: center;
        border-radius: unset;
        display: inline-flex;
        color: rgba(255, 255, 255, 0.8);
    }
    &&& .b181v2oy:hover,
    &&& .b181v2oy:focus {
        background: #424b63;
    }

    &&& .b181v2oy:disabled {
        background: #424b63;
        cursor: not-allowed;
    }
    &&& .b181v2oy svg {
        fill: currentColor;
        height: 16px;
        width: 16px;
    }

    .ant-space {
        padding-left: 0;
        padding-right: 0;
    }

    &&& .a9immln {
        background: #424b63;
    }

    /* .s1o2cezu{display:inline-block;border-right:1px solid #ddd;height:24px;margin:0 0.5em;} */

    & .global-colors-dropdown {
        left: 0% !important;
        bottom: 100% !important;
        top: unset !important;
    }

    && .ant-dropdown-menu-item-group {
        padding: 0;
    }

    & .bpsgbes.downward {
        & .global-colors-dropdown {
            top: 100% !important;
        }
    }

    & .${({ linkClass }) => linkClass} {
        &-popover {
            left: 0 !important;
            top: 0 !important;
            z-index: -99;

            & .ant-popover-inner-content > div {
                transform: translate(0, -100%);
            }
        }
    }

    & .bpsgbes.downward {
        .${({ linkClass }) => linkClass} {
            &-popover {
                & .ant-popover-inner-content > div {
                    transform: translate(0, 26px);
                }
            }
        }
    }
`;
