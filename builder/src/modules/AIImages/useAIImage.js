import { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BuilderContext } from '../../contexts/BuilderContext';
import { AIImageContext } from './context';

function useAIImage() {
    const context = useContext(AIImageContext);
    const { t } = useTranslation('builder');
    const { aiFetcher, handleUploadMedia } = useContext(BuilderContext);
    if (!context) {
        throw new Error('useAIImage should be called inside AIImageProvider');
    }
    const { aiState, dispatch, handleChange, ...rest } = context;
    const ref = useRef();
    ref.current = aiState;

    const clearState = () => {
        dispatch({ type: 'CLEAR' });
    };
    const setImages = async (payload) => {
        dispatch({ type: 'IMAGES', payload });
    };
    const removeImages = async (payload) => {
        dispatch({ type: 'REMOVE_IMAGE', payload: payload });
    };

    return {
        ...aiState,
        ...rest,
        setImages,
        clearState,
        aiFetcher,
        removeImages,
        handleChange,
        handleUploadMedia,
        images: aiState.images,
    };
}

export default useAIImage;
