import React from 'react';
import ColorPicker from './ColorPicker';

const BackgroundColor = ({ name, onChange, value, placeholder }) => {
    return (
        <ColorPicker
            name={name}
            value={value}
            colorVars={false}
            onChange={onChange}
            placeholder={placeholder}
        />
    );
};
export default React.memo(BackgroundColor);
