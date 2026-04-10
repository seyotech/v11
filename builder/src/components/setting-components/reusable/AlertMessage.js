import { Alert } from 'antd';
import React from 'react';

function AlertMessage({ errorMsg, type = 'error' }) {
    return (
        <Alert
            style={{ marginTop: 10 }}
            message={errorMsg}
            type={type}
            closable
        />
    );
}

export default AlertMessage;
