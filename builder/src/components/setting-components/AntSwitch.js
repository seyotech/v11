import React from 'react';
import { Switch } from 'antd';

const AntSwitch = ({ value, ...props }) => {
    return <Switch size="small" checked={value} {...props} />;
};

export default AntSwitch;
