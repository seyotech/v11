import { createGlobalStyle } from 'styled-components';

export const DropdownGlobalStc = createGlobalStyle`
        .ant-dropdown-menu-item-danger:hover span,
        .ant-dropdown-menu-item-danger:hover svg {
        color: #fff !important;
    }
    .global-colors-dropdown{
        .ant-dropdown-menu-item-group{
       & .ant-dropdown-menu-item-group-title {
            background: #0c0a25;
            margin: -4px -4px 5px;
            border-radius: 8px 8px 0 0;
        }
       & .ant-dropdown-menu-item-group-list{
        max-height: 320px;
        overflow-y: auto;
        margin: 0 !important;
       } 
    }
    }
   
`;
