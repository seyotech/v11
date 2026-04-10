import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';

export const Control = ({
    theme,
    icon,
    onClick,
    disabled,
    isActive,
    isPopupOpen,
    controlRef,
    wrapperClass = '',
}) => {
    const ref = useRef();
    const { buttonWrapper, button, active } = theme;
    const [dirClass, setDirClass] = useState('');

    useEffect(() => {
        const { top } = ref.current.getBoundingClientRect();

        if (isPopupOpen) {
            ref.current.parentElement.classList.add('visible');
        }

        if (top < 480) {
            setDirClass('downward');
        }
    }, [isPopupOpen]);

    useImperativeHandle(controlRef, () => ref.current);

    return (
        <div
            ref={ref}
            className={`${buttonWrapper} ${wrapperClass} ${dirClass}`}
            style={{ position: 'relative' }}
            onMouseDown={(event) => {
                event.preventDefault();
            }}
        >
            <button
                type="button"
                onClick={onClick}
                disabled={disabled}
                className={`${button} ${isActive ? active : ''}`}
            >
                <FontAwesomeIcon icon={icon} />
            </button>
        </div>
    );
};
