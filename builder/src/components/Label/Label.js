import React from 'react';
import { LabelStc } from './Label.stc';

function Label({ children, ...restOfProps }) {
    return <LabelStc {...restOfProps}>{children}</LabelStc>;
}

export default Label;
