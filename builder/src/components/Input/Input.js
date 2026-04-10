import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import InputStc, {
    Wrapper,
    Icon,
    Textarea,
    GroupPrepend,
    GroupAppend,
} from './Input.stc';

function Input(props) {
    const {
        as,
        icon,
        style,
        size = 'md',
        className,
        fontFamily,
        groupAppend,
        groupPrepend,
        ...restOfProps
    } = props;

    if (as === 'textarea') {
        return <Textarea size={size} as={as} rows="4" />;
    } else {
        return (
            <Wrapper
                size={size}
                style={style}
                hasIcon={!!icon}
                className={className}
            >
                {groupPrepend && <GroupPrepend>{groupPrepend}</GroupPrepend>}
                <InputStc hasIcon={!!icon} {...restOfProps} />
                {groupAppend && (
                    <GroupAppend size={size}>{groupAppend}</GroupAppend>
                )}
                {icon && (
                    <Icon>
                        <FontAwesomeIcon icon={icon} fixedWidth />
                    </Icon>
                )}
            </Wrapper>
        );
    }
}

export default Input;
