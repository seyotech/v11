import React from 'react';

import { Wrapper } from './Dropdown.stc';
import Popover from '../Popover';

function Dropdown({ children, content, placement = 'bottom' }) {
    return (
        <Popover
            placement={placement}
            content={
                <Wrapper>
                    <ul className="unstyle">{content}</ul>
                </Wrapper>
            }
        >
            {children}
        </Popover>
    );
}

export default Dropdown;
