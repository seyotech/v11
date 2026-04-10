import { Tree } from 'antd';
import styled from 'styled-components';

export const AntdTree = styled(Tree)`
    font-size: 14px;

    &.antd-custom-tree .ant-tree-switcher {
        height: 18px;
        line-height: 18px;
    }
    &.antd-custom-tree .ant-tree-treenode {
        width: 100%;
    }
    &.antd-custom-tree .ant-tree-switcher-noop {
        display: none;
    }
    &.antd-custom-tree .dragging {
        max-height: 18px;
    }
    &.ant-tree .ant-tree-node-content-wrapper .ant-tree-iconEle {
        width: 18px;
    }
    .ant-tree-indent-unit {
        width: 20px;
    }
    &.antd-custom-tree .ant-tree-node-content-wrapper {
        width: 100%;
    }
    &.antd-custom-tree .ant-tree-node-content-wrapper .ant-tree-iconEle,
    &.antd-custom-tree .ant-tree-node-content-wrapper {
        max-height: 18px;
        min-height: 18px;
        display: flex;
        align-items: center;
        padding: 0 0 0 2px;
    }
    &.antd-custom-tree .ant-tree-node-content-wrapper.ant-tree-node-selected {
        background-color: #e3f2ff;
    }
    &.antd-custom-tree .ant-tree-node-content-wrapper .ant-tree-title {
        flex-basis: 100%;
        white-space: nowrap;
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding-left: 4px;
        & .title-wrapper {
            display: flex;
            justify-content: space-between;
            .title {
                width: 120px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .action-btn {
                visibility: hidden;
                border: none;
                padding: 0 10px;
                border-radius: 0 5px 5px 0;
                background: #b6b7b8;
                color: #ffffff;
                cursor: pointer;
            }
            &:hover .action-btn {
                visibility: visible;
            }
        }
    }

    &.antd-custom-tree
        .ant-tree-node-content-wrapper.ant-tree-node-selected
        .ant-tree-title
        .action-btn {
        background-color: #588dd5;
    }

    &.antd-custom-tree .ant-tree-draggable-icon {
        display: none !important;
    }
    &.antd-custom-tree .global-symbol .ant-tree-node-content-wrapper {
        background-color: #1dad7130;
    }
`;
