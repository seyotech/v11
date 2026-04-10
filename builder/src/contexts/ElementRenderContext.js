import React from 'react';

export const ElementContext = React.createContext();
export const ElementContextProvider = ({ children, value }) => {
    return (
        <ElementContext.Provider value={value}>
            {children}
        </ElementContext.Provider>
    );
};

export const EditorContext = React.createContext();

export const EditorContextProvider = ({ children, value }) => {
    return (
        <EditorContext.Provider value={value}>
            {children}
        </EditorContext.Provider>
    );
};
