import React from 'react';

// not working version
const { useState, useEffect, useCallback } = React;
function useClickout(ref) {
    const [visible, setVisible] = useState(false);
    const handleClickout = useCallback(
        (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setVisible(false);
            }
        },
        [ref]
    );

    useEffect(() => {
        document.addEventListener('click', handleClickout);
        return () => document.removeEventListener('click', handleClickout);
    }, [ref, handleClickout]);

    return [ref, visible];
}

export default useClickout;
