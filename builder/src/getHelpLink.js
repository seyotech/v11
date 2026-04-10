import { helpLinks } from './helpLinks';

export const getHelpLink = ({ isWhiteLabelEnabled, content }) => {
    if (!content || typeof content !== 'string') return '';
    const obj = isWhiteLabelEnabled ? helpLinks.whiteLevel : helpLinks.dorik;
    if (!obj) return '';
    return obj[content];
};
