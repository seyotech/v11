import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import I18NextHttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import { isProd } from '../../config';
import getLoadPath from './getLoadPath';

i18n.use(I18NextHttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        returnEmptyString: false,
        keySeparator: false,
        nsSeparator: false,
        debug: !isProd,
        ns: 'builder',
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: getLoadPath(),
        },
        react: {
            wait: true,
            useSuspense: false,
        },
    });

export default i18n;
