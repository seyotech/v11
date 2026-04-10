import React from 'react';
import styled from 'styled-components';
import { AppstoreAddOutlined } from '@ant-design/icons';

function EmptyBlock() {
    return (
        <Block>
            <h4>
                <AppstoreAddOutlined
                    className="icon"
                    size="large"
                    style={{ fontSize: '48px' }}
                />
                <br /> Select Element on Canvas to active this Panel
            </h4>
        </Block>
    );
}
const Block = styled.div`
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    text-align: center;
    .icon {
        margin-bottom: 10px;
    }
    h4 {
        margin: auto 20px;
        padding: 30px;
        /* max-width: 200px; */
        border: 1px solid #fff;
        border-radius: 10px;
    }
`;
export default EmptyBlock;
