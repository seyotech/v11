import React from 'react';
import { Button, Tooltip } from 'antd';

function ToggleButton({ handlePosition, disabled, tooltipInfo, children }) {
    return (
        <Tooltip trigger="hover" {...tooltipInfo}>
            <Button
                style={{ borderColor: 'transparent' }}
                onClick={handlePosition}
                disabled={disabled}
                type="text"
                icon={children}
            ></Button>
        </Tooltip>
    );
}

export default ToggleButton;
