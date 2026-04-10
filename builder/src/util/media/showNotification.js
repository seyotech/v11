import { notification } from 'antd';

/**
 * @param {string} message
 * @param {string} description
 * @param {string} type
 * @returns
 */

const showNotification = ({ message, description, type = 'success' }) => {
    return notification[type]({
        message,
        placement: 'bottomLeft',
        duration: 5,
        description,
    });
};

export default showNotification;
