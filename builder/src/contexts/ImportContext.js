import React, { createContext, useReducer } from 'react';

const ImportContext = createContext();

const ImportProvider = ({ children, values }) => {
    const initialState = {
        ids: [],
        isImported: false,
        json: {},
    };

    const importReducer = (state, action) => {
        const { type, payload } = action;
        switch (type) {
            case 'ADD_LIST':
                return { ...state, ids: payload };
            case 'CLEAR_LIST':
                return { ...state, ids: [] };
            case 'IMPORT':
                return { ...state, isImported: payload };
            case 'JSON':
                return { ...state, json: payload };
            default:
                return state;
        }
    };
    const [state, dispatch] = useReducer(importReducer, initialState);

    return (
        <ImportContext.Provider value={{ state, dispatch, ...values }}>
            {children}
        </ImportContext.Provider>
    );
};

export { ImportContext, ImportProvider };
