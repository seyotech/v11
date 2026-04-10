import React from 'react';
import PasswordProtectionGuard from './PasswordProtectionGaurd';
import VisibilityType from './VisibilityType';

const PageVisibility = () => {
    return (
        <>
            <VisibilityType />
            <PasswordProtectionGuard />
        </>
    );
};

export default PageVisibility;
