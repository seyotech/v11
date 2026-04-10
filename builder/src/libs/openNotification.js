import { notification } from 'antd';

const openNotification = ({ type, message, description }) => {
    notification[type]({
        message,
        description,
        placement: 'bottomRight',
    });
};

export default openNotification;
