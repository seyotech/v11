import { createContext, useState } from 'react';
import { useIconSearch } from '../hooks';

export const IconContext = createContext({});

export const IconProvider = ({ type, icons, prefix, children, ...rest }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredIcons = useIconSearch({
        type,
        icons,
        prefix,
        query: searchTerm,
    });

    return (
        <IconContext.Provider
            value={{
                type,
                searchTerm,
                filteredIcons,
                setSearchTerm,
                ...rest,
            }}
        >
            {children}
        </IconContext.Provider>
    );
};
