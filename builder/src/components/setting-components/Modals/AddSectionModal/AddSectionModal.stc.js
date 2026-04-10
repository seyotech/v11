import styled from 'styled-components';

export const Title = styled.div`
    font-size: 18px;
    font-weight: 500;
    color: ${({ theme }) => theme.titleText};
`;

export const Body = styled.div`
    padding: 30px;
`;

export const TitleWrap = styled.div`
    display: flex;
    height: 60px;
    padding: 10px 30px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid ${({ theme }) => theme.borderPaleGrey};

    > div:first-child {
        flex: 2;
    }
    > div:last-child {
        flex: 1;
    }
`;
