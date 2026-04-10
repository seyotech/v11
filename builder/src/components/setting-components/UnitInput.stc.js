import styled from 'styled-components';

export const Input = styled.input`
    border: 0;
    width: 100%;
    height: ${({ isSidebar }) => (isSidebar ? '24px' : '30px')};
    padding: 5px;
    background: transparent;
    color: ${({ isPale, theme }) => (isPale ? theme.disabledText : 'inherit')};

    &:focus {
        outline: 0;
        border-color: #80bdff;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25) inset;
    }
`;

export const InputWrap = styled.div`
    position: relative;
    border-radius: 5px;
    width: ${({ width, isSidebar }) => width || '100%'};
    min-width: ${({ width }) => width};
    /* max-width: ${({ width }) => width}; */
    background: ${({ theme }) => theme.inputBg};
    border: 1px solid ${({ theme }) => theme.inputBorder};
    &:hover {
        .number-control {
            opacity: 1;
        }
    }
`;
export const NumberControls = styled.div`
    flex-direction: column;
    position: absolute;
    height: 100%;
    display: flex;
    right: 0;
    top: 0;
    opacity: 0;

    button {
        background-color: ${({ theme }) => theme.primary?.bg};
        border-color: ${({ theme }) => theme.inputBorder};
        border-width: 0 0 1px 1px;
        justify-content: center;
        align-items: center;
        border-style: solid;
        cursor: pointer;
        display: flex;
        width: 20px;
        padding: 0;
        flex: 1;

        &:focus {
            outline: none;
        }

        &:first-of-type {
            border-top-right-radius: 5px;
        }

        &:last-of-type {
            border-bottom-right-radius: 5px;
            border-bottom: 0;
        }
    }

    svg {
        vertical-align: 0;
        height: 10px;
        width: 10px;
    }
`;
