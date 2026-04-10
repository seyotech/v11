import { createContext, useReducer } from 'react';
export const AIImageContext = createContext();

const initialState = {
    images: [],
    modal: '',
    status: '',
};

const getImages = (state, payload) => {
    let images = [...state.images];

    if (!payload.merge) {
        images = payload.images;
    }
    if (payload.unshift) {
        images = [...payload.images, ...images];
    } else {
        images = [...images, ...payload.images];
    }

    return images;
};
const aiReducer = (state, action) => {
    const { type, payload } = action;

    switch (type) {
        case 'IMAGES':
            return {
                ...state,
                images: getImages(state, payload),
            };
        case 'REMOVE_IMAGE':
            return {
                ...state,
                images: state.images.filter((img) => img.id !== payload),
            };
        case 'CLEAR':
            return initialState;
        default:
            return state;
    }
};

export const AIImageContextProvider = ({ children, value }) => {
    const [aiState, dispatch] = useReducer(aiReducer, initialState);

    return (
        <AIImageContext.Provider value={{ aiState, dispatch, ...value }}>
            {children}
        </AIImageContext.Provider>
    );
};
