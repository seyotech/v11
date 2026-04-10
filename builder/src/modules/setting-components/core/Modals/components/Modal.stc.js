import { Tag } from 'antd';
import styled, { createGlobalStyle } from 'styled-components';
import { antToken } from '../../../../../antd.theme';
import { SIDEBAR_DIRECTION } from '../constants';

export const ModalWrapper = styled.div`
    & .ant-modal-content {
        padding: 0;
    }

    & .ant-modal-header,
    & .ant-drawer-header {
        margin-bottom: 0;
    }
`;

export const ModalHeaderStc = styled.div`
    & .ant-row {
        cursor: move;
        padding: 12px;
        margin: 0 !important;
    }

    & .ant-col {
        padding: 0 !important;
    }

    & svg {
        cursor: pointer;
    }
    .edit-address {
        font-size: 12px;
        font-weight: normal;
    }
    .ant-btn {
        font-size: 10px;
    }
`;
export const CustomTag = styled(Tag)`
    &.ant-tag {
        font-size: 10px;
        line-height: 20px;
    }
    cursor: pointer;
`;

const getSidePosition = ({ $sidebarPosition }) => {
    const sideOffset = $sidebarPosition === SIDEBAR_DIRECTION.LEFT ? '50px' : 0;

    return { [$sidebarPosition]: sideOffset };
};

export const DrawerWrapper = styled.div`
    & .ant-drawer-content-wrapper {
        box-shadow: none;
        border: 1px solid ${antToken.colorBorderSecondary};
    }

    & .ant-drawer-body,
    & .ant-drawer-header {
        padding: 0;
    }

    &&& .ant-row {
        cursor: default;
    }

    & .collapse-btn {
        top: 50%;
        width: 0;
        height: 0;
        ${getSidePosition}
    }
`;

export const FooterStc = styled.div`
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    height: 40px;
    display: flex;
    font-size: 14px;
    position: absolute;
    align-items: center;
    background-color: #fff;
    border-radius: 0 0 5px 5px;
    justify-content: space-between;
    color: ${({ theme }) => theme.bodyText};
    border-top: 2px solid ${({ theme }) => theme.inputBorder};
    a {
        color: ${({ theme }) => theme.bodyText};
        &:hover {
            color: ${({ theme }) => theme.primary.fg};
        }
    }
`;

const getModalPosition = ({ dragging }) => {
    if (dragging) return {};

    return {
        left: '50%',
        position: 'fixed',
        translate: '-50%',
    };
};

export const ModalGlobalStyle = createGlobalStyle`
    .draggable-modal .ant-modal {
        ${getModalPosition}

        &-wrap {
            inset: ${({ dragging }) => (!dragging ? 'auto' : 0)};
        }
    }
`;

export const AddElementStc = styled.div`
    &&& .ant-tabs-content-holder {
        padding: 0 24px;
        margin-bottom: 12px;
    }

    &&& .ant-tabs-nav-wrap {
        padding: 0 24px;
    }

    &&& .ant-tabs-nav-list > .ant-tabs-tab:nth-child(${({ total }) => total}) {
        margin-right: 24px;
    }

    &&& .ant-tabs-nav {
        margin-bottom: 8px;
    }
`;

export const AddElementHeaderStc = styled.div`
    .handler {
        cursor: move;
        background: #0c0a25;
        padding: 8px 24px 8px 24px;
        border-radius: 4px 4px 0 0;

        & > svg {
            color: #fff;
            font-size: 14px;
            cursor: pointer;
        }

        & > h5 {
            margin: 0;
            color: #fff;
            font-size: 16px;
        }
    }
`;
