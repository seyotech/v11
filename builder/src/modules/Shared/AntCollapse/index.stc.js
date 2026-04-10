import { Collapse } from 'antd';
import styled from 'styled-components';
import { antToken } from '../../../antd.theme';

export const AntCollapse = styled(Collapse)`
    border-radius: 0;
    background: #ffffff;
    border: 0;
    border-top: 1px solid ${antToken.colorBorder};
    margin-top: -0.5px;

    .ant-collapse-item:last-child {
        border-radius: 0;
    }
    && .ant-collapse-header {
        border-radius: 0;
        color: ${antToken.colorText};

        & .ant-collapse-expand-icon {
            padding-inline-end: 8px;
        }
    }
`;

export const AntCollapseAltStc = styled.div`
    &&& .ant-collapse {
        border-radius: 4px;
    }

    &&& .ant-collapse {
        &-header {
            padding: 4px 8px;
        }

        &-content-box {
            padding: 4px ${({ size }) => (size === 'small' ? '4' : '8')}px;
        }
    }

    & .icon {
        color: ${antToken.colorTextSecondary};
    }
`;
