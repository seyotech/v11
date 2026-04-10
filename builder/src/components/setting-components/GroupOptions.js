/*****************************************************
 * Packages
 ******************************************************/
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import React, { useState } from 'react';

const Header = styled.div`
    justify-content: space-between;
    align-items: center;
    padding: 10px 30px;
    cursor: pointer;
    display: flex;
    height: 60px;
`;
const GroupBody = styled.div`
    border-top: 1px solid var(--light-gray);
    padding: 20px 30px;
`;

const OptionsGroup = styled.div`
    background-color: #fff;
    margin-top: 5px;

    &:first-of-type {
        margin-top: 0;
    }
`;

const Title = styled.div`
    color: var(--heading-color);
    font-weight: 500;
    font-size: 18px;
`;

const GroupOptions = (props) => {
    const [collapsed, setCollapse] = useState(true);

    return (
        <OptionsGroup>
            <Header onClick={() => setCollapse(!collapsed)}>
                <Title>
                    {collapsed ? (
                        <FontAwesomeIcon size="xs" icon="chevron-right" />
                    ) : (
                        <FontAwesomeIcon size="xs" icon="chevron-down" />
                    )}{' '}
                    {props.title}
                </Title>
            </Header>
            {!collapsed && <GroupBody>{props.children}</GroupBody>}
        </OptionsGroup>
    );
};
export default React.memo(GroupOptions);
