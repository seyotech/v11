import React, { useContext } from 'react';
import Handlebars from 'handlebars';

export const CMSItemContext = React.createContext();

export const useCMSItem = () => {
    const data = useContext(CMSItemContext);

    const renderContent = (srcString) =>
        data ? Handlebars.compile(srcString)(data) : srcString;

    return { data, renderContent };
};
