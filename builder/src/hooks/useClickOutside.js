import { useCallback, useRef, useEffect } from 'react';
import useIframe from './useIframe';

function useClickOutside(cb) {
    const ref = useRef();
    const iframe = useIframe();
    const handleClickOutside = useCallback(
        (e) => {
            if (ref?.current && e && !ref.current.contains(e.target)) {
                cb();
            }
        },
        [cb]
    );

    useEffect(() => {
        // const iframe = document.getElementById('dorik-builder-iframe');
        if (iframe) {
            const iDoc = iframe.contentWindow || iframe.contentDocument;
            iDoc && iDoc.addEventListener('click', handleClickOutside);
        }
        document.addEventListener('click', handleClickOutside);

        // Clean up
        return () => {
            if (iframe) {
                const iDoc = iframe.contentWindow || iframe.contentDocument;
                iDoc && iDoc.removeEventListener('click', handleClickOutside);
            }
            document.removeEventListener('click', handleClickOutside);
        };
    }, [handleClickOutside, iframe]);

    return ref;
}

export default useClickOutside;
