import { useContext } from 'react';
import { BuilderContext } from '../contexts/BuilderContext';

const usePage = () => {
    const { pageId, siteId, selectPage, removePage, save, siteURL, isSaving } =
        useContext(BuilderContext);
    return { pageId, siteId, selectPage, removePage, save, siteURL, isSaving };
};

export default usePage;
