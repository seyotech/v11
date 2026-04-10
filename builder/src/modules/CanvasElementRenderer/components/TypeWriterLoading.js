export const TypeWriterLoading = () => {
    const dotSize = '8px';
    const animationTime = '0.8s';

    const loaderStyle = {
        textAlign: 'left',
    };

    const dotStyle = {
        display: 'inline-block',
        verticalAlign: 'middle',
        width: dotSize,
        height: dotSize,
        background: 'black',
        borderRadius: dotSize,
        animation: `loader ${animationTime} infinite alternate`,
    };

    const secondDotStyle = {
        ...dotStyle,
        animationDelay: '0.2s',
    };

    const thirdDotStyle = {
        ...dotStyle,
        animationDelay: '0.6s',
    };

    const keyframes = `
    @keyframes loader {
      0% {
        opacity: 0.9;
        transform: scale(0.5);
      }
      100% {
        opacity: 0.1;
        transform: scale(1);
      }
    }
  `;

    return (
        <div className="loader" style={loaderStyle}>
            <span style={dotStyle}></span>
            <span style={secondDotStyle}></span>
            <span style={thirdDotStyle}></span>
            <style>{keyframes}</style>
        </div>
    );
};
