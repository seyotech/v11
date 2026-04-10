import React from 'react';
import styled, { css } from 'styled-components';
import useEditorModal from '../../hooks/useEditorModal';

const InputGroup = styled.div`
    display: flex;
    font-size: 14px;
    border-radius: 5px;
    color: ${({ theme }) => theme.bodyText};

    > * {
        &:not(:last-child) {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
        &:not(:first-child) {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
        &:not(:first-child) {
            border-left-width: 0;
        }
    }

    .tab {
        li:first-child {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    }

    > .input-wrap {
        flex-grow: 1;
    }
`;

const inputStyle = css`
    border: 0;
    width: 100%;
    height: 100%;
    color: inherit;
    padding: 5px 10px;
    border-radius: 5px;
    background: ${({ theme }) => theme.inputBg};

    &:focus {
        outline: 0;
        border-color: #80bdff;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25) inset;
    }
`;

const Wrap = styled.div`
    border-radius: 5px;
    border: 1px solid
        ${({ theme, error }) => (error ? theme.danger[500] : theme.inputBorder)};
    height: ${({ isTextarea, isSidebar }) =>
        isTextarea ? 'auto' : isSidebar ? '26px' : '32px'};
`;

const InputSc = styled.input`
    ${inputStyle}
`;

const Span = styled.span`
    margin-top: 3px;
    font-size: 12px;
    position: absolute;
    display: inline-block;
    color: ${({ theme }) => theme.danger[500]};
`;

function InputUrl({ type, name, onChange, validate, value = '', placeholder }) {
    const [error, setError] = React.useState();
    const handleChange = (e) => {
        const value = e.target.value;
        onChange({ name, value });
    };

    const handleBlur = (e) => {
        const { value } = e.target;
        if (validate && typeof validate !== 'function') {
            const matched = value.trim().match(validate);
            if (matched) {
                setError('');
            } else {
                setError('The URL is invalid');
            }
        }
    };
    const { isSidebar } = useEditorModal();

    return (
        <>
            <InputGroup>
                <Wrap
                    error={error}
                    isSidebar={isSidebar}
                    className="input-wrap"
                >
                    <InputSc
                        type={type}
                        name={name}
                        value={value}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={placeholder}
                    />
                </Wrap>
            </InputGroup>
            {<Span>{error}</Span>}
        </>
    );
}

export default InputUrl;
