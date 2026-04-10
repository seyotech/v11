import { createContext, useMemo, useState } from 'react';

const DnDElementContext = createContext({});

const DnDElementProvider = ({ children }) => {
    const [focusedAddress, setFocusedAddress] = useState();
    const [isDraggingBoundary, setIsDraggingBoundary] = useState();
    const value = useMemo(
        () => ({
            focusedAddress,
            setFocusedAddress,
            isDraggingBoundary,
            setIsDraggingBoundary,
        }),
        [focusedAddress, isDraggingBoundary]
    );

    return (
        <DnDElementContext.Provider value={value}>
            {children}
        </DnDElementContext.Provider>
    );
};

export { DnDElementContext, DnDElementProvider };
