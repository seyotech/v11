const acceptedFileMeta = Object.freeze({
    image: {
        type: 'image/jpeg, image/png, image/svg+xml, image/webp',
        size: 6,
    },
    video: {
        type: 'video/mp4, video/webm, video/ogg',
        size: 16,
    },
    font: {
        type: 'application/x-font-ttf, application/font-woff, font/woff2, font/woff, font/ttf',
        size: 1,
    },
});

export default acceptedFileMeta;
