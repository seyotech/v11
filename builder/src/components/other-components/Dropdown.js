import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { prefix_ecs } from '../../config';

export const Option = ({ children, icon, onClick, dismiss }) => {
    const handleClick = () => {
        onClick();
        dismiss();
    };
    return (
        <li onClick={handleClick} className={`${prefix_ecs}__dropdown-item`}>
            {icon && (
                <FontAwesomeIcon fixedWidth className="icon" icon={icon} />
            )}
            {children}
        </li>
    );
};

const Dropdown = ({ children, button, color, ...restOfProps }) => {
    const ref = React.useRef();
    const [isOpen, open] = useState(false);
    const toggle = () => open(!isOpen);
    return (
        <div className={`${prefix_ecs}__dropdown`} {...restOfProps}>
            {button(toggle)}
            {isOpen && (
                <ul ref={ref} className={`${prefix_ecs}__dropdown-list`}>
                    {React.Children.map(children, (child) =>
                        React.cloneElement(child, { dismiss: toggle })
                    )}
                </ul>
            )}
        </div>
    );
};
export default Dropdown;
