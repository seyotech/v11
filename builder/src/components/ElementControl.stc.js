import { Button } from 'antd';
import styled, { css } from 'styled-components';

/*****************************************************
 * Styled Components
 ******************************************************/
export const Btn = styled.button`
    && {
        border: 0;
        padding: 0;
        color: #fff;
        min-width: 26px;
        font-size: 12px;
        min-height: 22px;
        border-radius: 3px;
        color: ${({ color }) => color.fg};
        cursor: ${({ drag }) => (drag ? 'move' : 'pointer')};
        background: ${({ color, altBg }) => (altBg ? color.altBg : color.bg)};
    }
`;

export const Controls = styled.div`
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';

    .add-new-column {
        right: 0;
        top: 50%;
        z-index: 9999;
        position: absolute;
        border-radius: 3px;
        background: rgb(230, 0, 173);
        transform: translateY(-50%);
    }
`;

export const ControlGroup = styled.div`
    && {
        display: flex;
        > div button {
            border-radius: 0;
            height: auto;
        }
        > div button:hover {
            color: ${({ color }) => color.fg};
            background: ${({ color }) => color.bg};
        }
        > div button[role='add-element']:hover {
            background: ${({ color }) => color.altBg};
        }
        > div:first-child button {
            border-top-left-radius: 3px;
            border-bottom-left-radius: 3px;
        }
        > div:last-child button {
            border-top-right-radius: 3px;
            border-bottom-right-radius: 3px;
        }
    }
`;

export function getFooterControlPosition({ $elType }) {
    switch ($elType) {
        case 'ROW': {
            return css`
                left: 50%;
                bottom: -22px;
                transform: translateX(-50%);
            `;
        }
        case 'CMSROW': {
            return css`
                left: 50%;
                bottom: -22px;
                transform: translateX(-50%);
            `;
        }
        case 'SECTION':
        default:
            return css`
                left: 50%;
                bottom: -22px;
                transform: translate(-50%, -50%);
            `;
    }
}

export const FooterControls = styled.div`
    bottom: 0;
    z-index: 999;
    font-size: 12px;
    position: absolute;
    border-radius: 3px;
    white-space: nowrap;
    color: rgb(255, 255, 255);
    transition: all 0.3s ease 0s;
    background: rgb(43, 53, 86);

    ${getFooterControlPosition}
`;

export const ButtonWrap = styled.div`
    z-index: 9999;
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 2px;
    right: 0;
    top: 0;
    .ant-btn {
        font-size: 14px;
        padding: 6px 16px;
        border-radius: 5px;
        border: none;
        &:not([disabled]) {
            color: rgb(255, 255, 255);
            background: rgb(43, 53, 86);
        }
    }
`;
export const RegenerateButton = styled(Button)`
    z-index: 9999;
    position: absolute;
    white-space: nowrap;
    font-size: 14px;
    padding: 6px 16px;
    border-radius: 5px;
    border: none;
    &:not([disabled]) {
        color: rgb(255, 255, 255);
        background: rgb(43, 53, 86);
    }
    right: 0;
    top: 0;
`;
