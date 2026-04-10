import styled from 'styled-components';

export const LabelStc = styled.label`
    text-align: left;
    font-size: 16px;
    font-weight: 400;

    color: #171a21;
    margin-bottom: 15px;
    display: ${({ inline }) => !inline && 'inline-block'};
`;
