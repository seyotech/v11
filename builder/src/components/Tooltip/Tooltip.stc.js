import styled, { css } from 'styled-components';

export const ChildrenWrap = styled.div`
    display: inline-block;
`;

export const TooltipWrap = styled.div`
    position: relative;
    display: inline-block;
`;

export const ContentWrap = styled.div`
    color: #fff;
    font-size: 12px;
    max-width: 400px;
    padding: 8px 10px;
    position: absolute;
    border-radius: 3px;
    white-space: nowrap;
    transition: all 0.25s;
    background: #2b3556;
    box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.2);

    ${getPlacement};

    &:after {
        content: '';
        width: 10px;
        height: 10px;
        position: absolute;
        border-radius: 2px;
        background: #2b3556;
    }
`;

function getPlacement({ position }) {
    switch (position) {
        case 'top-left': {
            return css`
                top: -35px;
                right: 50%;
                transform: translateX(20px);

                &:after {
                    right: 15px;
                    bottom: -4px;
                    transform: rotate(45deg);
                }
            `;
        }

        case 'top-right': {
            return css`
                top: -35px;
                left: 50%;
                transform: translateX(-20px);

                &:after {
                    left: 15px;
                    bottom: -4px;
                    transform: rotate(45deg);
                }
            `;
        }

        case 'bottom-left': {
            return css`
                bottom: -35px;
                right: 50%;
                transform: translateX(20px);

                &:after {
                    right: 15px;
                    top: -4px;
                    transform: rotate(45deg);
                }
            `;
        }

        case 'bottom-right': {
            return css`
                bottom: -35px;
                left: 50%;
                transform: translateX(-20px);

                &:after {
                    left: 15px;
                    top: -4px;
                    transform: rotate(45deg);
                }
            `;
        }

        case 'left': {
            return css`
                top: 50%;
                right: 100%;
                transform: translate(-6px, -50%);

                &:after {
                    top: 50%;
                    right: -4px;
                    transform: translateY(-50%) rotate(45deg);
                }
            `;
        }

        case 'right': {
            return css`
                top: 50%;
                left: 100%;
                transform: translate(6px, -50%);

                &:after {
                    top: 50%;
                    left: -4px;
                    transform: translateY(-50%) rotate(45deg);
                }
            `;
        }
        case 'bottom': {
            return css`
                left: 50%;
                top: 35px;
                transform: translateX(-50%);

                &:after {
                    left: 50%;
                    top: -4px;
                    transform: translateX(-50%) rotate(45deg);
                }
            `;
        }
        default: {
            return css`
                left: 50%;
                top: -35px;
                transform: translateX(-50%);

                &:after {
                    left: 50%;
                    bottom: -4px;
                    transform: translateX(-50%) rotate(45deg);
                }
            `;
        }
    }
}
