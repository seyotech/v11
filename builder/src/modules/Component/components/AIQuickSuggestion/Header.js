import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Typography } from 'antd';
import React from 'react';
import { Header } from './style.stc';

function HeaderComp({ title, isLoading, handleRefresh }) {
    return (
        <Header>
            <Typography.Paragraph>{title}</Typography.Paragraph>
            <Button
                size="small"
                type="primary"
                ghost
                title={title}
                onClick={handleRefresh}
                icon={
                    <FontAwesomeIcon
                        spin={isLoading}
                        icon={icon({
                            name: 'refresh',
                            style: 'regular',
                        })}
                    />
                }
            />
        </Header>
    );
}

export default HeaderComp;
