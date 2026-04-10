import React from 'react';
import Button from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled, { css } from 'styled-components';

const ButtonSc = styled(Button)`
    height: 32px;
    width: 32px;
`;

const IconButton = ({ children, icon, ...rest }) => {
    return (
        <ButtonSc {...rest}>
            {icon && <FontAwesomeIcon icon={icon} />}
            {children}
        </ButtonSc>
    );
};
export default IconButton;
