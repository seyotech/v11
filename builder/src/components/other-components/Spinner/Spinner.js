import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
`;

export default function Spinner() {
    return (
        <Wrapper>
            <FontAwesomeIcon
                spin
                fixedWidth
                size="2x"
                icon={['far', 'spinner']}
            />
        </Wrapper>
    );
}
