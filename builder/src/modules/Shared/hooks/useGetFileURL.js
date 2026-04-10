import { ComponentRenderContext } from '@dorik/html-parser';
import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';

const validUrlRegex = /^https?:\/\//i;

export const useGetFileURL = () => {
    const { CDNDomain } = useContext(ComponentRenderContext);
    const { t } = useTranslation('builder');
    return useCallback(
        (url = '') => {
            if (typeof url !== 'string') {
                throw new Error(t('Invalid input URL must be a string'));
            }

            if (!url.trim()) {
                return '';
            }

            return validUrlRegex.test(url) ? url : `${CDNDomain}/${url}`;
        },
        [CDNDomain]
    );
};
