import { Button, Row } from 'antd';
import styled from 'styled-components';

export const HamBurger = styled(Button)`
    height: 40px;
    width: 50px !important;
    z-index: 999;
    border: none;
    position: absolute;
    border-radius: 0;
    color: #d9d5eb;
    border-bottom: 1px solid #45426e;
    &&&&:hover {
        color: #d9d5eb;
        background: transparent;
    }
`;
export const SidebarRow = styled(Row)`
    flex-direction: row;
    height: 100%;
    justify-content: center;
    & .bottom-sidebar {
        align-self: flex-end;
    }
    & .menus {
        width: 40px;
        margin-top: 2px;
        & li {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 8px;
            width: 32px;
            & .ant-menu-title-content {
                display: none;
            }
            & .ant-menu-item-icon {
                font-size: 16px;
            }
        }
    }

    .ant-menu-submenu-title {
        margin: 0;
    }

    && .ant-menu-item {
        color: rgba(217, 213, 235, 1);
    }
`;
