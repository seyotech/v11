/*****************************************************
 * Packages
 ******************************************************/
import PropTypes from 'prop-types';
import { forwardRef, useEffect, useRef } from 'react';
import { FixedSizeGrid } from 'react-window';

/*****************************************************
 * Locals
 ******************************************************/
import { PADDING_SIZE } from '../constants';
import { Cell } from './Cell';

export const IconList = (props) => {
    const gridRef = useRef();

    useEffect(() => {
        const scrollToItem = setTimeout(() => {
            gridRef.current?.scrollToItem({
                ...props.position,
                align: 'center',
            });
        }, 1);

        return () => {
            clearTimeout(scrollToItem);
        };
    }, [gridRef, props.position]);

    return (
        <div style={{ overflow: 'hidden' }}>
            <FixedSizeGrid
                {...props}
                ref={gridRef}
                innerElementType={innerElementType}
            >
                {({ columnIndex, rowIndex, style }) => (
                    <Cell
                        style={style}
                        rowIndex={rowIndex}
                        columnIndex={columnIndex}
                    />
                )}
            </FixedSizeGrid>
        </div>
    );
};

const innerElementType = forwardRef(({ style, ...rest }, ref) => (
    <div
        ref={ref}
        style={{
            ...style,
            height: `${parseFloat(style.height) + PADDING_SIZE * 2}px`,
        }}
        {...rest}
    />
));

IconList.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    rowCount: PropTypes.number.isRequired,
    rowHeight: PropTypes.number.isRequired,
    columnWidth: PropTypes.number.isRequired,
    columnCount: PropTypes.number.isRequired,
    position: PropTypes.object,
};
