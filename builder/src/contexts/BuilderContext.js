import React, { createContext, useState } from 'react';

export const BuilderContext = createContext();

export const BuilderContextProvider = ({ children, value }) => {
    const [isBuilderFocus, setBuilderFocus] = useState(false);
    return (
        <BuilderContext.Provider
            value={{ ...value, isBuilderFocus, setBuilderFocus }}
        >
            {children}
        </BuilderContext.Provider>
    );
};
