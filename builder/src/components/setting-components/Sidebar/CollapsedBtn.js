import React from 'react';
import styled, { css } from 'styled-components';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';

function collapseBtn({ handleClick, collapsed, sidebarPosition }) {
    const renderIcon = () => {
        if (sidebarPosition === 'right') {
            return collapsed ? <LeftOutlined /> : <RightOutlined />;
        } else {
            return collapsed ? <RightOutlined /> : <LeftOutlined />;
        }
    };
    return (
        <ToggleWrap onClick={handleClick} sidebarPosition={sidebarPosition}>
            {renderIcon()}
        </ToggleWrap>
    );
}
const getStyle = ({ sidebarPosition }) => {
    if (sidebarPosition === 'right') {
        return css`
            left: -20px;
            border: 2px solid #dedede;
            border-right: none;
        `;
    } else {
        return css`
            right: -20px;
            border: 2px solid #dedede;
            border-left: none;
        `;
    }
};

const ToggleWrap = styled.div`
    position: absolute;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background: #f4f6f9;
    color: #000;
    width: 20px;
    height: 60px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
        color: #fff;
        background: var(--color-primary-500);
        border-color: var(--color-primary-500);
    }
    ${getStyle}
`;
export default collapseBtn;
