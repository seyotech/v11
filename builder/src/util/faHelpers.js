import { library } from '@fortawesome/fontawesome-svg-core';
export { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const addFaIcon = (...icons) => {
    library.add(...icons);
};
