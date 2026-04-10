/*****************************************************
 * Packages
 ******************************************************/
import React, { Fragment, useState, useContext } from 'react';
import styled from 'styled-components';

/*****************************************************
 * Local
 ******************************************************/
import { ThemeContext } from 'styled-components';
import Button from '../other-components/Button';
import InputGroup from './InputGroup';
import UnitInput from './UnitInput';

const InputLockGroup = styled.div`
    display: flex;
    .input-group {
        flex: 1;
    }
`;

const LockableInput = (props) => {
    const { style, options, onChange, isSidebar } = props;
    const [locked, setLock] = useState(false);
    const [lastChanged, setLastChanged] = useState();
    const { primary } = useContext(ThemeContext);

    const handleLock = (prevProp, nextProp) => {
        if (!locked && lastChanged) {
            const { value, name } = lastChanged;
            const otherValue =
                name === prevProp
                    ? { name: nextProp, value }
                    : { name: prevProp, value };

            onChange([lastChanged, otherValue]);
        }
        setLock(!locked);
    };

    const handleChange = (payload) => {
        const { value } = payload;
        setLastChanged(payload);
        if (locked) {
            const lockedData = options.map((item) => ({
                name: item.name,
                value,
            }));
            onChange(lockedData);
        } else {
            onChange([payload]);
        }
    };

    return (
        <InputLockGroup style={style} isSidebar={isSidebar}>
            {options.map((input, index) => (
                <Fragment key={input.name}>
                    <InputGroup
                        key={index}
                        labelWidth={isSidebar ? '55px' : '70px'}
                        label={input.label}
                        className="input-group"
                        isSidebar={isSidebar}
                    >
                        <UnitInput
                            type="numeric"
                            defaultUnit="px"
                            name={input.name}
                            value={input.value}
                            onChange={handleChange}
                            isSidebar={isSidebar}
                            hasPlaceholder={input.matched}
                        />
                    </InputGroup>

                    {index === 0 && (
                        <Button
                            type="none"
                            btnType="button"
                            icon={['far', 'lock-alt']}
                            style={{
                                padding: '0 5px',
                                color: locked ? primary.fg : '',
                                margin: '0 6px',
                            }}
                            onClick={() =>
                                handleLock(input.name, options[index + 1].name)
                            }
                        />
                    )}
                </Fragment>
            ))}
        </InputLockGroup>
    );
};
export default React.memo(LockableInput);
