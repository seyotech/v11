const generateError = ({
    message = 'something went wrong please reload and try again',
    type = 'error',
}) => {
    const error = new Error();
    error.message = message;
    error.type = type;

    return error;
};

export default generateError;
