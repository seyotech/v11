import styled from 'styled-components';
import { antToken } from '../../../../antd.theme';

export const FrameStc = styled.div`
    height: 200px;
    overflow: auto;

    & ul {
        gap: 8px;
        display: grid;
        grid-template-columns: repeat(${({ gridCount }) => gridCount}, 1fr);
    }

    && li {
        cursor: pointer;
        padding: 12px 8px;
        border-radius: 4px;
        border: 1px solid ${antToken.colorBorder};

        &.active {
            border: 1px solid ${antToken.colorPrimary};

            & .frame svg {
                color: ${antToken.colorPrimary};
            }
        }

        &.ant-list-item:last-child {
            border: 1px solid ${antToken.colorBorder};

            &.active {
                border: 1px solid ${antToken.colorPrimary};

                & .frame svg {
                    color: ${antToken.colorPrimary};
                }
            }
        }

        & .frame {
            width: 100%;
            height: ${({ gridHeight = '16' }) => `${gridHeight}px`};

            svg {
                width: 100%;
                height: 100%;
                color: #2b3556;
            }
        }
    }
`;
