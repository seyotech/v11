import { createContext } from 'react';
import useManageMedia from 'hooks/media-library/useManageMedia';

export const FileUploadContext = createContext(null);

const FileUploadContextProvider = ({ children, value }) => {
    const context = useManageMedia();
    return (
        <FileUploadContext.Provider value={{ ...context, ...value }}>
            {children}
        </FileUploadContext.Provider>
    );
};

export default FileUploadContextProvider;
