import styled from 'styled-components';
import { antToken } from '../../../../antd.theme';

const getBorderStyle = ({ border = '' }) =>
    border.split(' ').reduce((styles, direction) => {
        styles[`border-${direction}`] = `1px solid ${antToken.colorBorder}`;
        return styles;
    }, {});

const positionKeys = ['top', 'right', 'bottom', 'left'];
const getPositionStyle = ({ position = '' }) =>
    position.split(' ').reduce((styles, value, index) => {
        styles[positionKeys[index]] = value;
        return styles;
    }, {});

const FloatingStc = styled.div`
    color: #fff;
    width: 24px;
    z-index: 999;
    height: 24px;
    display: flex;
    cursor: pointer;
    position: absolute;
    align-items: center;
    justify-content: center;
    border-radius: 0 0 0 4px;
    background: rgba(0, 0, 0, 0.6);

    ${getBorderStyle}
    ${getPositionStyle}
`;

/**
 * Represents the Floating component.
 * This component is responsible for displaying it's content float position.
 *
 * @param {object} props - The props for the Floating component.
 * @param {string} props.border - The direction of border to apply the border style of the Floating component.
 * @param {object} props.position - The position of the Floating component.
 *
 * @returns {JSX.Element} The rendered Floating component.
 *
 * @example
 * <Floating
 *    border="left top"
 *    position="10 20"
 * >
 * content goes here
 * </Floating>
 */
export const Floating = (props) => <FloatingStc {...props} />;
