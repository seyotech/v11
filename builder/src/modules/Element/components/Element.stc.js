import { Card, Typography } from 'antd';
import styled from 'styled-components';

export const CardStc = styled(Card)`
    &&&.ant-card {
        position: relative;
        width: 108px;
        height: 80px;
        padding: 12px 8px;
        text-align: center;
        border-radius: 4px;
        border: 1px solid #d9d9d9;
        user-select: none !important;
        background-color: ${({ isElementAccessible }) =>
            isElementAccessible ? '' : '#e7e7e7ba'};
        &:hover {
            cursor: ${({ canDrag, isElementAccessible }) =>
                !isElementAccessible
                    ? 'no-drop'
                    : canDrag
                    ? 'grab'
                    : 'pointer'};
        }
        .pro-element {
            position: absolute;
            scale: 0.8;
            top: 0px;
            right: -10px;
        }
    }
    .ant-card-body {
        padding: 0;
        border-radius: 0;
    }
`;

export const ParagraphStc = styled(Typography.Paragraph)`
    font-size: 13px;
    line-height: 20px;
    letter-spacing: -0.4px;
    &&.ant-typography {
        margin: 0;
        margin-top: 8px;
    }
`;
