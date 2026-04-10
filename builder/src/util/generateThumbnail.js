import htmlToFile from './htmlToFile';

const generateThumbnail = async (builderContent) => {
    const frameBody = builderContent.body;

    return htmlToFile({
        html: frameBody,
        options: {
            quality: 0.9,
            height: 720,
            canvasHeight: 720,
            canvasWidth: 1280,
        },
    });
};

export default generateThumbnail;
