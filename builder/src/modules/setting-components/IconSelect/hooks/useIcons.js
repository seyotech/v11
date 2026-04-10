import { useContext } from 'react';

import { IconContext } from '../context/IconProvider';

export const useIcons = () => {
    return useContext(IconContext);
};
