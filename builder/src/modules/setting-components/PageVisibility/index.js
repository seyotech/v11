import { EditorContext } from 'contexts/ElementRenderContext';
import PasswordProtectionGuard from './components/PasswordProtectionGuard';
import VisibilityType from './components/VisibilityType';
import { useContext } from 'react';

export const PageVisibility = (props) => {
    const { currentPage } = useContext(EditorContext);
    const isPasswordEnable = !!currentPage.isPasswordEnable;

    return (
        <>
            <VisibilityType {...props} isPasswordEnable={isPasswordEnable} />
            {isPasswordEnable && <PasswordProtectionGuard />}
        </>
    );
};
