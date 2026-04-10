import styled from 'styled-components';

export const CustomBox = styled.div`
    width: 26.5px;
    height: 28px;
`;
export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    .ant-typography {
        margin-bottom: 0;
    }
    svg {
        cursor: pointer;
    }
`;
export const OverLayLoading = styled.div`
    position: absolute;
    inset: 0;
    display: flex;
    background: rgba(0, 0, 0, 0.3);
    color: #fff;
    z-index: 999;
    justify-content: center;
    align-items: center;
`;
export const FontSettingsWrap = styled.div`
    position: relative;
`;
export const FontWrapper = styled.div`
    padding: 4px;
    border-radius: 4px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.4s;
    border: 1px solid #f0f0f0;
    .ant-typography {
        margin-bottom: 4px;
    }
    &.active,
    &:hover {
        border-color: #3a30ba;
    }

    &:last-child {
        margin-bottom: 0;
    }
`;
export const PaletteWrapper = styled.div`
    display: flex;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid #f0f0f0;
    padding: 4px;
    position: relative;
    cursor: pointer;
    transition: all 0.4s;
    &:hover {
        border: 1px solid #3a30ba;
        .hoverable-content {
            visibility: visible;
        }
    }
    &.active {
        border-color: #3a30ba;
    }
    .color:first-child {
        border-bottom-left-radius: 4px;
        border-top-left-radius: 4px;
    }
    .color:last-child {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
    }
`;

export const HoverableContent = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
    visibility: hidden;
    .ant-btn {
        width: 24px;
        height: 24px;
        padding: 0;
        font-size: 14px;
        background: #fff !important;
        border: 1px solid #fff;
        border-radius: 50%;
    }
`;
export const ColorsWrapper = styled.div`
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(2, 1fr);
`;

export const Label = styled.div`
    display: flex;
    margin-left: -4px;
    align-items: center;
    justify-content: space-between;
`;
