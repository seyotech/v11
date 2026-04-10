import React from 'react';
import { nanoid } from 'nanoid';

import RenderComponentWithLabel from 'modules/Shared/settings-components/RenderComponentWithLabel';
import UnitInput from 'modules/Shared/settings-components/UnitInput';
import { GenerateTextBtnWrapper } from 'modules/setting-components/RichTextEditor/components/RichTextEditor.stc';
import AITextGenerator from '../../../AITextGenerator';
import InputDate from './InputDate';
import InputText from './InputText';
import InputTextArea from './InputTextArea';
import InputTime from './InputTime';

/**
 * Renders a component based on the input type specified in the props and handles the onChange event.
 * @param {Object} props - An object containing the following properties:
 *   @param {Object} props.module - The module name.
 *   @param {function} props.onChange - A callback function to handle the onChange event.
 *   @param {function} [props.mutateOnChange] - A function to mutate the value before calling the onChange callback.
 *   @param {string} [props.inputType] - The type of input component to render.
 * @returns {JSX.Element} - The rendered component with the specified input type, width set to "100%", and the handleOnChange function as the handleOnChange prop.
 */
let uuid = nanoid(6);
const Input = (props) => {
    const { module, enableAI, onChange, mutateOnChange } = props;
    const inputType = props.inputType;
    const type = !!inputType && inputType.toLowerCase();

    const Component = {
        text: InputText,
        input: InputText,
        time: InputTime,
        date: InputDate,
        textarea: InputTextArea,
        number: UnitInput,
        id: InputText,
        url: InputText,
    }[type || 'text'];

    const handleOnChange = (payload) => {
        typeof mutateOnChange === 'function'
            ? onChange(mutateOnChange(payload))
            : onChange(payload);
    };

    const handleUpdate = ({ value }) => {
        onChange({ value, name: props.name });
        uuid = nanoid(6);
    };

    return (
        <RenderComponentWithLabel
            {...props}
            onChange={handleUpdate}
            module={module}
            labelExtra={
                enableAI ? (
                    <GenerateTextBtnWrapper>
                        <AITextGenerator
                            value={props.value}
                            onChange={handleUpdate}
                        />
                    </GenerateTextBtnWrapper>
                ) : null
            }
        >
            <Component
                {...props}
                key={uuid}
                type={type}
                width="100%"
                handleOnChange={handleOnChange}
            />
        </RenderComponentWithLabel>
    );
};

export default React.memo(Input);
