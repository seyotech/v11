import React from 'react';
import styled from 'styled-components';

const Div = styled.div`
    ul {
        margin: 0;
        font-size: 13px;
        padding: 0 0 0 20px;
    }
`;

function HelpText(props) {
    const { message } = props;

    return <Div dangerouslySetInnerHTML={{ __html: message }}></Div>;
}

export default HelpText;
