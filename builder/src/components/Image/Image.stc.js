import styled, { css } from 'styled-components';

function getType({ type }) {
    switch (type) {
        case 'circle': {
            return css`
                border-radius: 100%;
            `;
        }
        default:
            return null;
    }
}

const ImgStc = styled.img`
    border-style: none;
    vertical-align: middle;

    ${getType}
`;

export default ImgStc;
