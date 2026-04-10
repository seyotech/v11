import { Tree } from 'antd';
import styled from 'styled-components';

const AntdTree = styled(Tree.DirectoryTree)`
    &&& .ant-tree-node {
        &-content-wrapper {
            display: flex;

            & .ant-tree-iconEle {
                margin-left: -6px;
            }
            &:hover {
                background-color: #f4f6f9;
            }
        }
    }

    .ant-tree-title {
        flex: 1;
    }

    & .ant-tree-list {
        color: rgba(0, 0, 0, 0.25);
    }

    &&& .ant-tree-treenode.dragging:after {
        border: none;
    }

    &&& .ant-tree-switcher-noop {
        display: none;
    }

    &&& .ant-tree-switcher {
        margin-left: -4px;

        & svg {
            font-size: 12px;
        }
    }

    &&&&&& .ant-tree-node-selected {
        background-color: #e6eaf0;
        &:hover {
            background-color: #e6eaf0;
        }
    }

    &&& .ant-tree-treenode {
        &-selected {
            &::before {
                background-color: #e6eaf0;
                color: rgba(0, 0, 0, 0.25);
            }
            &:hover::before {
                background-color: #e6eaf0;
                color: rgba(0, 0, 0, 0.25);
            }
            & .ant-tree-switcher,
            & .ant-tree-node-content-wrapper {
                color: rgba(0, 0, 0, 0.25);
            }
        }
        &.global-symbol .title {
            color: #389e0d;
        }
    }

    &&& .ant-tree-treenode.activeDropDown::after {
        position: absolute;
        top: 0;
        inset-inline-end: 0;
        bottom: 4px;
        inset-inline-start: 0;
        content: '';
        pointer-events: none;
        background-color: #f4f6f9;
    }
`;

export default AntdTree;
