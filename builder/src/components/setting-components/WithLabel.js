import React from 'react';
import styled from 'styled-components';
import Label from './Label/Label';

const LabelWrap = styled.div`
    margin-top: ${(props) => (props.noMargin ? '0' : '20px')};
`;

const WithLabel = ({ label, children, noMargin, module = {} }) => {
    return (
        <LabelWrap noMargin={noMargin}>
            {module.labelPosition !== 'inline' && (
                <Label module={module}>{label}</Label>
            )}
            {children}
        </LabelWrap>
    );
};
export default WithLabel;
