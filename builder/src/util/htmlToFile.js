import { toBlob } from 'html-to-image';

const htmlToFile = async ({
    html,
    name = 'thumbnail.webp',
    type = 'image/webp',
    options = {},
}) => {
    const blob = await toBlob(html, { ...options });
    return new File([blob], name, {
        type,
    });
};

export default htmlToFile;
