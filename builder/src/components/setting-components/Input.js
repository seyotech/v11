import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import React, { useCallback, useState, useContext } from 'react';
import QuickFontFamily from './Modals/QuickFontFamily';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    EditorContext,
    ElementContext,
} from '../../contexts/ElementRenderContext';
import getPathValue from '../../util/getPathValue';
import FontSelection from './FontSelection';
import useEditorModal from '../../hooks/useEditorModal';

const TextFooter = styled.div`
    font-size: 14px;
    margin-top: 10px;

    span {
        cursor: pointer;
        margin-left: 5px;
        color: ${({ theme }) => theme.primary.fg};
    }
`;

const inputStyle = css`
    border: 0;
    width: 100%;
    height: 100%;
    color: inherit;
    padding: 4px 8px;
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
    height: ${({ isTextarea, isSidebar }) =>
        isTextarea ? 'auto' : isSidebar ? '26px' : '32px'};
    border: 1px solid
        ${({ theme, hasError }) => (hasError ? 'red' : theme.inputBorder)};
`;
const InputSc = styled.input`
    ${inputStyle}
`;

const Textarea = styled.textarea`
    ${inputStyle};
    display: block;
    max-width: 100%;
    min-width: 100%;
    min-height: 32px;
    line-height: 1.5;
`;

const Input = (props) => {
    const {
        name,
        hasError,
        onChange,
        selectFont,
        value = '',
        defaultValue,
        placeholder,
        mutateOnChange,
        ...restOfProps
    } = props;
    const [isQuickFontModalVisible, setQuickFontModalVisible] = useState(false);
    const { getDataByAddress, onSaveSettings } = useContext(ElementContext);
    const { currentEditItem = {} } = useContext(EditorContext);
    const { type: elementType, titleType } = currentEditItem;
    let modalHeading = 'Body';
    let path = 'style/fontFamily';
    let weight = 'style/fontWeight';
    if (elementType === 'heading') {
        path = `heading/${titleType}/${path}`;
        weight = `heading/${titleType}/${weight}`;
        modalHeading = titleType.toUpperCase();
    }
    modalHeading = `Default ${modalHeading} Font`;

    const data = getDataByAddress();
    const fontFamily = getPathValue(path, data);

    const type = props.inputType || 'text';
    const isTextarea = type === 'textarea';
    const handleChange = (event) => {
        const input = { name, value: event.target.value };
        typeof mutateOnChange === 'function'
            ? onChange(mutateOnChange(input))
            : onChange(input);
    };

    const toggleQuickFontSelection = useCallback(() => {
        setQuickFontModalVisible(!isQuickFontModalVisible);
    }, [isQuickFontModalVisible]);

    const { isSidebar } = useEditorModal();

    const handleChangeFont = useCallback(
        (payload) => {
            onSaveSettings(payload, null);
        },
        [onSaveSettings]
    );

    if (isTextarea) {
        return (
            <>
                <Wrap
                    {...restOfProps}
                    isSidebar={isSidebar}
                    isTextarea={isTextarea}
                    className="input-wrap"
                >
                    <Textarea
                        rows={8}
                        defaultValue={defaultValue || value}
                        value={value}
                        onChange={handleChange}
                        placeholder={placeholder}
                    ></Textarea>
                </Wrap>
                {selectFont && (
                    <>
                        <p>* Rich text editor is temporarily disabled</p>
                        <TextFooter>
                            {fontFamily ? 'Default ' : 'Set '}Font:{' '}
                            <strong>{fontFamily}</strong>{' '}
                            <span onClick={toggleQuickFontSelection}>
                                <FontAwesomeIcon icon={['far', 'edit']} />
                            </span>
                        </TextFooter>
                    </>
                )}

                {isQuickFontModalVisible && (
                    <QuickFontFamily
                        heading={modalHeading}
                        close={toggleQuickFontSelection}
                    >
                        <FontSelection
                            currentEditItem={data}
                            module={{ modules: [path, weight] }}
                            handleChange={handleChangeFont}
                        />
                    </QuickFontFamily>
                )}
            </>
        );
    } else {
        return (
            <Wrap
                {...restOfProps}
                isSidebar={isSidebar}
                hasError={hasError}
                className="input-wrap"
            >
                <InputSc
                    type={type}
                    name={name}
                    value={value || defaultValue}
                    isSidebar={isSidebar}
                    onChange={handleChange}
                    placeholder={placeholder}
                    {...restOfProps}
                />
            </Wrap>
        );
    }
};

Input.propTypes = {
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string,
};

export default React.memo(Input);
