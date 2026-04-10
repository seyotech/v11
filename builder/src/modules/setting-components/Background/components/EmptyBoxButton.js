import styled from 'styled-components';

const Button = styled.div`
    border: 1px dashed var(--color-border-500);
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    color: var(--blue);
    cursor: pointer;
    display: flex;
    height: 80px;
    padding-bottom: 0 !important;
`;

const EmptyBoxButton = ({ children, ...props }) => {
    return <Button {...props}>{children}</Button>;
};
export default EmptyBoxButton;
