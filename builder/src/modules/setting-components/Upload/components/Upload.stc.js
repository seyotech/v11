import styled from 'styled-components';
import { antToken } from '../../../../antd.theme';

export const iconStyles = {
    fontSize: 14,
    cursor: 'pointer',
    color: antToken.colorLink,
};

export const PreviewAreaStc = styled.div`
    display: flex;
    height: 160px;
    overflow: hidden;
    position: relative;
    border-radius: 6px;
    align-items: center;
    margin-bottom: -4px;
    justify-content: center;
    border: 1px dashed #d9d9d9;
    background: rgba(12, 10, 37, 0.02);

    img {
        width: 100%;
    }

    & .ant-drawer {
        &-content-wrapper {
            text-align: center;
            height: 24px !important;
        }

        &-body {
            padding: 1px;
            cursor: pointer;
        }
    }

    .remove {
        top: 0;
        right: 0;
        color: #fff;
        width: 24px;
        height: 24px;
        z-index: 9999;
        display: flex;
        cursor: pointer;
        position: absolute;
        align-items: center;
        justify-content: center;
        border-radius: 0 0 0 6px;
        background: ${antToken.colorLink};
        border-left: 1px solid ${({ theme }) => theme.inputBorder};
        border-bottom: 1px solid ${({ theme }) => theme.inputBorder};
    }
`;

export const MediaOverlay = styled.div`
    inset: 0;
    opacity: 0;
    padding: 12px;
    display: flex;
    cursor: pointer;
    flex-wrap: wrap;
    transition: 0.5s;
    position: absolute;
    place-content: center;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.6);
`;

export const ReplaceImage = styled.div`
    left: 0;
    right: 0;
    bottom: 0;
    height: 24px;
    background: #fff;
    position: absolute;
    text-align: center;
`;

export const MediaViewStc = styled.div`
    width: 100%;
    height: 427px;

    & .no-data {
        top: 50%;
        position: relative;
        transform: translate(0, -50%);
    }
`;

export const MediaStc = styled.div`
    width: 238px;
    height: 157px;
    overflow: hidden;
    position: relative;
    border-radius: 6px;
    &:hover .media-overlay {
        opacity: 1;
    }
`;

export const MediaOverlayFooter = styled.div`
    width: 90%;
    color: #fff;
    bottom: 10px;
    display: flex;
    gap: 10px;
    position: absolute;
    justify-content: space-between;
`;
