import useIframeHook from 'hooks/useIframe';
import { useCallback, useEffect, useRef } from 'react';

const scrollAmount = -50; // Adjust this value for faster scrolling
const frameInterval = 16.67; // 60 frames per second

export const useScrollOnDrag = () => {
    const { contentWindow } = useIframeHook();
    const scrollDataRef = useRef({
        lastFrameTime: 0,
    });

    const handleScroll = useCallback(
        (timestamp) => {
            const elapsed = timestamp - scrollDataRef.current.lastFrameTime;

            if (elapsed > frameInterval) {
                contentWindow.scrollBy({
                    top: scrollAmount,
                    behavior: 'smooth',
                });
                scrollDataRef.current.lastFrameTime = timestamp;
            }
        },
        [contentWindow]
    );

    const handleDragStart = useCallback(
        (event) => {
            const { clientY } = event;
            if (clientY <= 100) {
                handleScroll(performance.now());
            }
        },
        [handleScroll]
    );

    useEffect(() => {
        window.addEventListener('dragover', handleDragStart);

        return () => {
            window.removeEventListener('dragover', handleDragStart);
        };
    }, [handleDragStart, contentWindow]);
};
