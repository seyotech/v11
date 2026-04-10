// export const API_URL = import.meta.env.VITE_APP_API_URL;
// export const GRAPHQL_API_URL = API_URL + '/graphql';

export const prefix = 'dorik';
export const prefix_bcs = 'dorik-bcs';
export const prefix_ecs = 'dorik-ecs';

export const STAGE = import.meta.env.VITE_APP_STAGE;
export const isProd = import.meta.env.PROD;
export const isDev = process.env.NODE_ENV === 'development';
export const SENTRY_RELEASE_NUMBER = import.meta.env.VITE_SENTRY_RELEASE;

// export const DISCOUNT = 0;
export const SITE_DATA = 'SITE_DATA';
export const appName = {
    STATIC: 'STATIC',
    CMS: 'CMS',
};

export const DORIK_SITE_POSTFIX = import.meta.env.VITE_DORIK_SITE_POSTFIX;
export const RECAPTCHA_SITE_KEY = '6LfxVrIZAAAAAMYckwABoEPexND9lD-YhzjDIu3Z';
