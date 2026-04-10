import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { LI, Colors, ColorsWrap, Heading } from './Colors.sc';

export function GlobalColors({
    name,
    value,
    colors,
    onChange,
    ...restOfProps
}) {
    const selectColor = React.useCallback(
        (color) => {
            onChange({ name, value: color });
        },
        [onChange, name]
    );

    return (
        <ColorsWrap {...restOfProps}>
            <Heading>Global Colors</Heading>
            <Colors>
                <li
                    title="Clear Color"
                    className="no-style"
                    onClick={() => selectColor('')}
                >
                    <FontAwesomeIcon icon={['fas', 'ban']} />
                </li>
                {colors &&
                    colors.map((color, i) => (
                        <LI
                            key={i}
                            title={color.key}
                            color={color.value}
                            active={color.key === value?.key}
                            onClick={() => selectColor(color)}
                        />
                    ))}
            </Colors>
        </ColorsWrap>
    );
}
