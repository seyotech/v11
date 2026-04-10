import { useEffect } from 'react';
/**
 *
 * @param {String} url
 * @param {Boolean} async
 * @param {Boolean} defer
 */
const useScript = (url, async = true, defer = true) => {
    useEffect(() => {
        const found = document.querySelector(`script[src="${url}"]`);
        if (!found) {
            const script = document.createElement('script');
            script.src = url;
            script.async = async;
            script.defer = defer;
            document.body.appendChild(script);

            return () => document.body.removeChild(script);
        }
    }, [async, defer, url]);
};

export default useScript;
