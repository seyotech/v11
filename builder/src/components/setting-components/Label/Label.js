import React from 'react';
import styled, { css } from 'styled-components';

import useCMS from '../../../hooks/useCMS';
import ResponsiveControl from '../ResponsiveControl';
import useEditorModal from '../../../hooks/useEditorModal';
import DropdownInput from '../DropdownInput/CmsDropdown';
import { renderCMSInput } from '../../../util/cmsConditions';

function getGroupTitle({ theme, group }) {
    if (group) {
        return css`
            /* margin-top: 20px; */
            /* padding-top: 10px; */
            margin-bottom: 8px;
            text-transform: uppercase;
            color: ${theme.primary.fg};
            border-top: 1px solid ${theme.borderPaleGrey};
            border-bottom: 1px solid ${theme.borderPaleGrey};

            &:first-of-type {
                border-top: 0;
            }
        `;
    }
}

const Wrapper = styled.div`
    display: flex;
    color: var(--color-title-text-500);
    ${getGroupTitle}
`;

const LabelSC = styled.label`
    color: currentColor;
    margin-bottom: 8px;
    margin-right: 10px;
    font-weight: 500;
    font-size: ${({ isSidebar }) => (isSidebar ? '12px' : '14px')};
`;

const Label = ({
    name,
    style,
    value,
    module,
    display,
    onChange,
    children,
    className,
    activeHover,
}) => {
    const dropdownProps = { name, value, onChange };
    const context = useCMS();
    const { isSidebar } = useEditorModal();
    return (
        <Wrapper group={module?.group} className={className} style={style}>
            <LabelSC isSidebar={isSidebar}>{children}</LabelSC>

            {module && module.isResponsible && !activeHover && (
                <ResponsiveControl display={display} />
            )}
            {module?.cmsFields && context ? (
                renderCMSInput(module) ? (
                    <DropdownInput
                        {...dropdownProps}
                        cmsFields={module.cmsFields}
                    />
                ) : null
            ) : null}
        </Wrapper>
    );
};
export default React.memo(Label);
