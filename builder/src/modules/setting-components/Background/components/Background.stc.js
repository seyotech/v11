import styled, { createGlobalStyle } from 'styled-components';

export const GlobalColorsRoot = createGlobalStyle`
    :root {
        ${(props) => props.globalColors}
    }
`;

export const Wrapper = styled.div`
    height: 60px;
    width: 100%;
    background-color: #e3e3e3;
    background-image: ${(props) => props.background && props.background};
    position: relative;
    border-radius: 4px;
    cursor: pointer;
    margin: 12px 0;
`;

export const Preview = styled.div`
    height: 95px;
    width: 100%;
    border-radius: 8px;
    background-color: #e3e3e3;
    background-image: ${(props) => props.background && props.background};
`;

export const ControlWrap = styled.div`
    margin-top: 30px;
`;

export const ColorWrap = styled.div`
    grid-template-columns: repeat(1, 1fr);
    grid-column-gap: 20px;
    display: grid;
    margin-top: 30px;
`;

export const Picker = styled.div`
    height: ${(props) => (props.isSelected ? '15px' : '12px')};
    width: ${(props) => (props.isSelected ? '15px' : '12px')};
    border-radius: 50%;
    position: absolute;
    top: 100%;
    left: ${(props) => (props.isSelected ? '-5px' : '-3px')};
    border: ${(props) =>
        props.isSelected ? '3px solid white;' : '3px solid transparent'};
    box-shadow: 0 2px 10px rgb(0 0 0 / 50%);
    background: ${(props) => props.background && props.background};
`;

export const MarkerButton = styled.div`
    position: absolute;
    background-color: rgba(255, 255, 255, 0.5);
    height: 100%;
    width: 5px;
    color: ${(props) => (props.color ? props.color : '#e3e3e3')};
    left: ${(props) => props.left && props.left}%;
    &:hover {
        cursor: pointer;
    }
`;

export const MarkerDelete = styled.div`
    height: 15px;
    width: 15px;
    background: white;
    box-shadow: 0 2px 10px rgb(0 0 0 / 25%);
    position: absolute;
    top: -15px;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    left: -5px;
`;

export const GridWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
    justify-items: center;
`;

export const WrapperAlt = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 5px;
    cursor: pointer;
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
