import { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';

import { prefix_bcs } from '../../../config';
import useDnD from '../../../hooks/useDnD';
import EmptyCanvas from './EmptyCanvas';

const activeBG = ({ $isActive, $bodyText }) => {
    return {
        background: $isActive ? '#3a30ba' : '',
        border: `1px dashed ${$bodyText}`,
    };
};

const EmptyDrop = styled.div`
    ${activeBG}
`;

const getChildType = (type) => {
    return {
        row: 'column',
        section: 'row',
        column: 'component',
        container: 'container',
        page: 'page',
    }[type];
};

const DnDTarget = (props) => {
    const { children, type } = props;
    const childType = getChildType(type);
    const emptyProps = { ...props, type: childType };
    const { isOver, canDrop, connectDropTarget } = useDnD(emptyProps);

    const { bodyText } = useContext(ThemeContext);

    const isActive = isOver && canDrop;

    if (type === 'page') {
        return (
            <EmptyCanvas
                isActive={isActive}
                connectDropTarget={connectDropTarget}
            >
                {children}
            </EmptyCanvas>
        );
    } else {
        return (
            <EmptyDrop
                $bodyText={bodyText}
                $isActive={isActive}
                ref={connectDropTarget}
                className={prefix_bcs}
            >
                {children}
            </EmptyDrop>
        );
    }
};

export default DnDTarget;
