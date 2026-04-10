import styled, { css } from 'styled-components';

function getSize({ size, as }) {
    switch (size) {
        case 'sm': {
            return css`
                height: ${as === 'textarea' ? '' : '24px'};
                font-size: 1.4rem;
            `;
        }
        case 'lg': {
            return css`
                height: 40px;
                font-size: 1.8rem;
            `;
        }
        default:
            return css`
                height: 32px;
                font-size: 1.6rem;
            `;
    }
}

const InputStc = styled.input`
    border: 0;
    display: block;
    color: #464a53;
    padding: 4px 8px;
    border-radius: 5px;
    font-family: inherit;
    background: transparent;
    width: ${({ hasIcon }) => (hasIcon ? 'calc(100% - 60px)' : '100%')};
`;

export const Textarea = styled.textarea`
    width: 100%;
    display: block;
    color: #464a53;
    padding: 4px 8px;
    border-radius: 5px;
    font-family: inherit;
    background: #f4f6f9;
    border: 1px solid #e5ebf0;

    ${getSize};
`;

export const Wrapper = styled.div`
    width: 100%;
    display: flex;
    border-radius: 5px;
    border: 1px solid #e5ebf0;
    /* height: ${({ hasIcon }) => (hasIcon ? '60px' : '50px')}; */
    background-color: ${({ hasIcon }) => !hasIcon && '#f4f6f9'};
    border-width: ${({ hasIcon }) => hasIcon && '2px'};

    ${getSize};
`;

export const Icon = styled.div`
    width: 60px;
    display: flex;
    color: #757b8a;
    font-size: 20px;
    align-items: center;
    background: #f4f6f9;
    justify-content: center;
    border-left: 1px solid #e5ebf0;
`;

export default InputStc;

export const GroupPrepend = styled.div`
    background: red;
`;
export const GroupAppend = styled.div`
    background: white;
    border-radius: 0 5px 5px 0;
    border-left: 1px solid #e5ebf0;

    ${getGrpupAppendSize}
`;

function getGrpupAppendSize({ size }) {
    switch (size) {
        case 'sm': {
            return css`
                padding: 0 10px;
                line-height: 24px;
            `;
        }
        case 'md':
        default: {
            return css`
                padding: 0 15px;
                line-height: 30px;
            `;
        }
    }
}
