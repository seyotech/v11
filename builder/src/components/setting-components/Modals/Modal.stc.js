import styled from 'styled-components';

export const Title = styled.div`
    font-size: 18px;
    cursor: pointer;
    font-weight: 500;
    padding: 20px 30px;
    color: ${({ theme }) => theme.titleText};
    background: ${({ theme }) => theme.primary.bg};
    border-bottom: 1px solid ${({ theme }) => theme.borderPaleGrey};
`;

export const Body = styled.div`
    padding: 30px;
    background: ${({ theme }) => theme.primary.bg};
`;
