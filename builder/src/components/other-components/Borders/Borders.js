import styled from 'styled-components';
import { prefix } from '../../../config';

const Border = styled.div`
    &.highlight {
        border-style: dashed;
        border-color: ${({ color }) => color?.bg};
        border-width: 1px;
    }

    &.active {
        border-style: solid;
        border-width: 4px;
    }
`;

const calculateBorderClasses = ({
    renderBorder,
    direction,
    canDrop,
    isOver,
    dir,
}) => {
    const isActive = isOver && direction === dir;
    const axis = ['left', 'right'].includes(dir) ? 'x' : 'y';
    const isHighlighted =
        (axis === 'x' && ['left', 'right'].includes(direction)) ||
        (axis === 'y' && ['top', 'bottom'].includes(direction));

    const classNames = [];

    if (canDrop && isActive) {
        classNames.push('active');
    }

    if ((canDrop && isHighlighted) || renderBorder) {
        classNames.push('highlight');
    }

    return classNames.join(' ');
};

const Borders = (props) => {
    const { color } = props;

    return ['left', 'right', 'top', 'bottom'].map((dir) => {
        const classNames = calculateBorderClasses({ ...props, dir });

        return (
            <Border
                key={dir}
                color={color}
                className={`${prefix}-controls-border ${prefix}-controls-border-${dir} ${classNames}`}
            />
        );
    });
};

export default Borders;
