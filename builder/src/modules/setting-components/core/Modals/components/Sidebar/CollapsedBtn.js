/*****************************************************
 * Packages
 ******************************************************/
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { antToken } from '../../../../../../antd.theme';
import { SIDEBAR_DIRECTION } from '../../constants';

const leftArrow = icon({ name: 'chevron-left', style: 'regular' });
const rightArrow = icon({ name: 'chevron-right', style: 'regular' });

export const CollapsedBtn = ({ handleClick, collapsed, sidebarPosition }) => {
    const icon =
        (sidebarPosition === SIDEBAR_DIRECTION.RIGHT && collapsed) ||
        (sidebarPosition === SIDEBAR_DIRECTION.LEFT && !collapsed)
            ? leftArrow
            : rightArrow;

    return (
        <ToggleWrap onClick={handleClick}>
            <FontAwesomeIcon style={{ fontSize: 12 }} icon={icon} />
        </ToggleWrap>
    );
};
const getStyle = ({ sidebarPosition }) => {
    if (sidebarPosition === 'right') {
        return css`
            left: -12px;
            border-right: none;
            border: 1px solid ${antToken.colorBorderSecondary};
        `;
    } else {
        return css`
            right: -12px;
            border-left: none;
            border: 1px solid ${antToken.colorBorderSecondary};
        `;
    }
};

const ToggleWrap = styled.div`
    top: 50%;
    color: #000;
    width: 12px;
    height: 40px;
    display: flex;
    cursor: pointer;
    position: absolute;
    align-items: center;
    background: #f4f6f9;
    flex-direction: row;
    transition: all 0.3s;
    justify-content: center;
    transform: translateY(-50%);
    &:hover {
        color: #fff;
        background: var(--color-primary-500);
        border-color: var(--color-primary-500);
    }
    ${getStyle}
`;

CollapsedBtn.propTypes = {
    sidebarPosition: T.string,
    collapsed: T.bool.isRequired,
    handleClick: T.func.isRequired,
};
