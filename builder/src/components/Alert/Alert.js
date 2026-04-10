import PropTypes from 'prop-types';
import React from 'react';

import AlertStc from './Alert.stc';

function Alert(props) {
    const { children, message } = props;
    return <AlertStc {...props}>{children || message}</AlertStc>;
}

Alert.propTypes = {
    type: PropTypes.string,
    message: PropTypes.string,
};

export default Alert;
