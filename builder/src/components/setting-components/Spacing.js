import React from 'react';

import LockableInput from './LockableUnitInput';
import chunk from '../../util/chunk';
import useEditorModal from '../../hooks/useEditorModal';

const Spacing = (props) => {
    const {
        value,
        options,
        mqValue,
        onChange,
        mqEnabled,
        name: path,
        hoverEnabled,
    } = props;
    const altEnabled = mqEnabled || hoverEnabled;
    const original = new Map(value);
    let spacing = original;
    if (mqEnabled) {
        spacing = new Map(mqValue);
    }

    const getValues = (group) => {
        const x = group.map((input) => ({
            ...input,
            value: spacing.get(input.name) || original.get(input.name) || '',
            matched:
                altEnabled &&
                (spacing.get(input.name) === undefined ||
                    spacing.get(input.name) === original.get(input.name)),
        }));
        return x;
    };

    const handleChange = (data) => {
        data.forEach((payload) => {
            const { name, value } = payload;
            if (altEnabled && value === '') {
                spacing.delete(name);
            } else {
                spacing.set(name, value);
            }
        });

        // sending data as event mock
        onChange({
            name: path,
            value: Array.from(spacing),
        });
    };
    const { isSidebar } = useEditorModal();

    return (
        <React.Fragment>
            {chunk(options, 2).map((group, grpIndex) => (
                <LockableInput
                    key={grpIndex}
                    index={grpIndex}
                    isSidebar={isSidebar}
                    onChange={handleChange}
                    options={getValues(group)}
                    style={{ marginBottom: '8px' }}
                />
            ))}
        </React.Fragment>
    );
};

export default React.memo(Spacing);
