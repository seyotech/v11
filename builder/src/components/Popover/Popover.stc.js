import styled, { css } from 'styled-components';

const PopoverStc = styled.div`
    z-index: 999;
    position: absolute;
    box-shadow: 0 5px 20px 0 rgba(43, 53, 86, 0.15);
    ${getPlacement};

    .caret {
        width: 20px;
        box-shadow: 0 5px 20px 0 rgba(43, 53, 86, 0.15);
        height: 20px;
        background: #fff;
        position: absolute;
        border-radius: 2px;
    }
`;

export const Wrapper = styled.div`
    /* position: relative; */
    display: inline-block;
`;

export const PopoverBody = styled.div`
    z-index: 10;
    position: relative;
    border-radius: 5px;
    background-color: #ffffff;
`;

function getPlacement({ placement }) {
    switch (placement) {
        case 'topRight': {
            return css`
                right: 0;
                bottom: calc(100% + 10px);

                .caret {
                    right: 25px;
                    bottom: -9px;
                    transform: rotate(45deg);
                }
            `;
        }
        case 'topLeft': {
            return css`
                left: 0;
                bottom: calc(100% + 10px);

                .caret {
                    left: 25px;
                    bottom: -9px;
                    transform: rotate(45deg);
                }
            `;
        }
        case 'bottomLeft': {
            return css`
                left: 0;
                top: calc(100% + 10px);

                .caret {
                    left: 25px;
                    top: -9px;
                    transform: rotate(45deg);
                }
            `;
        }
        case 'bottomRight': {
            return css`
                right: 0;
                top: calc(100% + 10px);

                .caret {
                    right: 25px;
                    top: -10px;
                    transform: rotate(45deg);
                }
            `;
        }
        case 'bottom': {
            return css`
                left: 50%;
                top: calc(100% + 10px);
                transform: translateX(-50%);

                .caret {
                    left: 50%;
                    top: -9px;
                    transform: translateX(-50%) rotate(45deg);
                }
            `;
        }
        case 'top': {
            return css`
                left: 50%;
                bottom: calc(100% + 10px);
                transform: translateX(-50%);

                .caret {
                    left: 50%;
                    bottom: -9px;
                    transform: translateX(-50%) rotate(45deg);
                }
            `;
        }
        case 'left': {
            return css`
                top: 50%;
                right: calc(100% + 10px);
                transform: translateY(-50%);

                .caret {
                    top: 50%;
                    right: -9px;
                    transform: translateY(-50%) rotate(45deg);
                }
            `;
        }
        case 'right': {
            return css`
                top: 50%;
                left: calc(100% + 10px);
                transform: translateY(-50%);

                .caret {
                    top: 50%;
                    left: -9px;
                    transform: translateY(-50%) rotate(45deg);
                }
            `;
        }

        default:
            return ``;
    }
}

export const TriggerWrap = styled.div`
    cursor: pointer;
`;

export default PopoverStc;
