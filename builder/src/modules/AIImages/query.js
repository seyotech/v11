import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useToast } from 'util/toast';
import { getImageVariation, imageGenerateByModelType } from './service';

export const useAIImageGenerate = () => {
    const toast = useToast();
    const { t } = useTranslation('builder');

    return useMutation(imageGenerateByModelType, {
        onSuccess: () => {
            toast('success', t('AI Image has been generated successfully.'));
        },
        onError: (error = {}) => {
            toast('error', error.message || t('Something Went Wrong!!'));
        },
    });
};

export const useGetAIImageVariation = () => {
    const toast = useToast();
    const { t } = useTranslation('builder');

    return useMutation(getImageVariation, {
        onSuccess: () => {
            toast('success', t('AI Image has been generate successfully'));
        },
        onError: (error = {}) => {
            toast('error', error.message || t('Something Went Wrong!!'));
        },
    });
};
