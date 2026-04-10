import { css } from 'styled-components';

export const inputField = css`
    height: ${({ isSidebar }) => (isSidebar ? '26px' : '32px')};
    padding: ${({ isSidebar }) => (isSidebar ? '0 8px' : '4px 8px')};
    border-radius: 5px;
    background: ${({ theme }) => theme.inputBg};
    border: 1px solid ${({ theme }) => theme.inputBorder};
`;
