export const renderCMSInput = (module = {}) => {
    const templates = ['RichTextEditor'];
    if (templates.includes(module.template)) {
        return false;
    } else {
        return true;
    }
};
