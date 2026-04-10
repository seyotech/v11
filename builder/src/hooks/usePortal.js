import { useRef, useEffect } from 'react';

function setAttributes(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

function createRootElement(attrs, events) {
    const rootContainer = document.createElement('div');
    setAttributes(rootContainer, attrs);
    events.forEach(({ name, method }) => {
        rootContainer.addEventListener(name, method);
    });
    return rootContainer;
}

function addRootElement(rootElem) {
    document.body.appendChild(rootElem);
}

function usePortal(attrs, events = []) {
    const rootElemRef = useRef(null);

    useEffect(() => {
        const existingParent =
            document.querySelector(`#${attrs.id}`) ||
            document.querySelector(`.${attrs.class}`);
        const parentElem = existingParent || createRootElement(attrs, events);

        if (!existingParent) {
            addRootElement(parentElem);
        }

        parentElem.appendChild(rootElemRef.current);

        return function removeElement() {
            rootElemRef.current.remove();
            if (!parentElem.childElementCount) {
                parentElem.remove();
            }
        };
    }, [attrs, events]);

    function getRootElem() {
        if (!rootElemRef.current) {
            rootElemRef.current = document.createElement('div');
        }
        return rootElemRef.current;
    }

    return getRootElem();
}

export default usePortal;
