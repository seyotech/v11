import styled, { css } from 'styled-components';

function getType({ type }) {
    switch (type) {
        case 'warning': {
            return css`
                background: #fee5b5;
            `;
        }
        case 'info': {
            return css`
                background: var(--color-info-100);
                border: 1px solid var(--color-info-300);
            `;
        }
        case 'danger': {
            return css`
                background: var(--color-danger-100);
                border: 1px solid var(--color-danger-300);
            `;
        }
        case 'success': {
            return css`
                background: var(--color-success-100);
                border: 1px solid var(--color-success-300);
            `;
        }
        default:
            return null;
    }
}

const AlertStc = styled.div`
    padding: 13px 20px;
    border-radius: 5px;
    line-height: 1.5;
    ${getType}
`;

export default AlertStc;
