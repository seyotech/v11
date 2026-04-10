const Video = ({ src, name }) => (
    <video
        controls={false}
        preload="metadata"
        onLoadedMetadata={({ target: video }) =>
            (video.currentTime = video.duration * 0.1)
        }
        style={{ height: '100%' }}
        data-testid={name}
    >
        <source src={src} type="video/mp4" />
    </video>
);

export default Video;
