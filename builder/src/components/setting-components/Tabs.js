import React from 'react';
import Tab, { TabOption } from './reusable/Tab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * @typedef {Object} Props
 * @property {Array<Object>} options
 * @property {function} onChange
 * @property {string} name
 * @property {string} [inputType]
 *
 * @param {Props} param0
 */
const Tabs = ({
    name,
    value,
    options,
    onChange,
    inputType,
    defaultValue,
    mutateOnChange,
}) => {
    // eslint-disable-next-line eqeqeq
    const selected = value == undefined ? defaultValue : value;

    const handleChange = (input) => {
        typeof mutateOnChange === 'function'
            ? onChange(mutateOnChange(input))
            : onChange(input);
    };

    return (
        <Tab
            name={name}
            className="tab"
            type={inputType}
            selected={selected}
            onSelect={handleChange}
        >
            {options.map((opt, index) => (
                <TabOption key={index} value={opt.value}>
                    {opt.icon ? (
                        <FontAwesomeIcon
                            className="icon"
                            icon={opt.icon.split(' ')}
                        />
                    ) : null}
                    {opt.label}
                </TabOption>
            ))}
        </Tab>
    );
};
export default React.memo(Tabs);
