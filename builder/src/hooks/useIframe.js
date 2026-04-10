import { useCallback } from 'react';

const useIframe = (frameId = 'dorik-builder-iframe') => {
    const getIframe = useCallback(() => {
        const iframe = document.getElementById(frameId);
        if (!iframe) return;

        const { contentDocument, contentWindow } = iframe;
        return { contentDocument, contentWindow };
    }, [frameId]);

    return getIframe();
};

export default useIframe;
