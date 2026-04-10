import { App } from 'antd';

export const useToast = () => {
    const { notification } = App.useApp();

    const toast = (type, content) => {
        notification[type || 'success']({
            placement: 'bottomLeft',
            description: content,
        });
    };

    return toast;
};
