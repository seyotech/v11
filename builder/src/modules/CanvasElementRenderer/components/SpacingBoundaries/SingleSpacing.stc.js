import styled from 'styled-components';
import { directionEnum, spacingTypeEnum } from '../../constants/spacingEnum';

const getSpecificCSS = ({ direction, type, number, unit }) => {
    let css = '';
    const isNegativeMargin = type === spacingTypeEnum.MARGIN && number < 0;
    const amount = Math.abs(number);
    const shouldApplybreadth = (amount > 10 || unit !== 'px') && amount > 0;
    if ([directionEnum.LEFT, directionEnum.RIGHT].includes(direction)) {
        css += `top: 0;
        height: 100%;
        width: ${shouldApplybreadth ? `${amount}${unit}` : '10px'};
        cursor: ew-resize;
        `;
    }
    if ([directionEnum.TOP, directionEnum.BOTTOM].includes(direction)) {
        css += `left: 0;
        width: 100%;
        height: ${shouldApplybreadth ? `${amount}${unit}` : '10px'};
        cursor: ns-resize;
        `;
    }
    if (direction === directionEnum.LEFT) {
        css += 'left: 0;';
        if (type === spacingTypeEnum.MARGIN && !isNegativeMargin) {
            css += `transform: translateX(-100%);`;
        }
    }
    if (direction === directionEnum.RIGHT) {
        css += 'right:0;';
        if (type === spacingTypeEnum.MARGIN && !isNegativeMargin) {
            css += `transform: translateX(100%);`;
        }
    }
    if (direction === directionEnum.BOTTOM) {
        css += `bottom:0;`;
        if (type === spacingTypeEnum.MARGIN && !isNegativeMargin) {
            css += `transform: translateY(100%);`;
        }
    }
    if (direction === directionEnum.TOP) {
        css += 'top:0;';
        if (type === spacingTypeEnum.MARGIN && !isNegativeMargin) {
            css += `transform: translateY(-100%);`;
        }
    }
    return css;
};

export const SpacingBoundary = styled.div`
    position: absolute;
    pointer-events: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: ${({ address, $isDragging }) =>
        address.split('.').length * ($isDragging ? 2 : 1)};
    opacity: ${({ $isDragging, $isHovered, forceVisible }) =>
        $isDragging || $isHovered || forceVisible ? 1 : 0};
    background: ${({ type }) =>
        type === spacingTypeEnum.MARGIN
            ? 'rgba(207, 129, 56, 0.4)'
            : 'rgba(0, 191, 0, .4)'};
    &:hover {
        opacity: ${({ $isHovered, forceVisible }) =>
            $isHovered || forceVisible ? 1 : 0};
    }
    & .content {
        display: flex;
        gap: 4px;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
    }
    ${getSpecificCSS}
`;

export const MarginExtra = styled(SpacingBoundary)`
    background: rgba(207, 129, 56, 0.2);
    &:hover {
        opacity: 1;
    }
    ${({ direction }) => {
        let css = '';
        if ([directionEnum.LEFT, directionEnum.RIGHT].includes(direction)) {
            css += 'width: 10px;';
        }
        if ([directionEnum.TOP, directionEnum.BOTTOM].includes(direction)) {
            css += 'height: 10px;';
        }
        css += `${direction}: -10px;`;
        return css;
    }}
`;
