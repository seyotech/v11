import styled from 'styled-components';

const GroupContainerStc = styled.div`
    gap: 12px;
    display: flex;
    flex-direction: column;

    &.divider > :not(:last-child, .collapse-alt, :empty) {
        padding-bottom: 12px;
        border-bottom: 1px solid #f0f0f0;
    }
`;

export const GroupContainer = ({ children, className, style }) => {
    return (
        <GroupContainerStc style={style} className={className}>
            {children}
        </GroupContainerStc>
    );
};
