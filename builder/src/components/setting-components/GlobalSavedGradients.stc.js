import styled from 'styled-components';

export const GridWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 10px;
    margin-bottom: 15px;
    justify-items: center;
`;

export const Wrapper = styled.div`
    width: 48px;
    height: 48px;
    border-radius: 5px;
    background-image: ${(props) =>
        props.gradient ||
        `radial-gradient(
        circle at 50% 50%,
        rgba(28, 255, 54, 0.4) 30%,
        rgba(0, 189, 231, 1) 89%
    )`};
    position: relative;
    justify-items: center;
`;

export const OptionWrap = styled.div`
    height: 100%;
    width: 100%;
    position: absolute;
    display: none;
    background: rgba(0, 0, 0, 0.3);
    color: white;
    gap: 10px;
    font-size: 16px;

    ${Wrapper}:hover & {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;
