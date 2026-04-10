import { useEffect } from 'react';

const useInitScript = (el) => {
    useEffect(() => {
        document.body.appendChild(el);

        return () => {
            document.body.removeChild(el);
        };
    }, [el]);
};

export default useInitScript;
