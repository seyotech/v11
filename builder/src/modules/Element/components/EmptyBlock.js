/*****************************************************
 * Packages
 ******************************************************/
import styled from 'styled-components';

/*****************************************************
 * Local
 ******************************************************/
import { adjustFloatSize, getColCount } from '../utils/element';
import { antToken } from '../../../antd.theme';

/*****************************************************
 * Styles
 ******************************************************/
const EmptyBody = styled.div`
    display: grid;
    grid-gap: 12px;
    grid-template-columns: repeat(3, 1fr);
`;

const Block = styled.div`
    height: 50px;
    display: grid;
    cursor: pointer;
    grid-column-gap: 2px;
    grid-template-columns: repeat(${({ col }) => (col ? col : 3)}, 1fr);

    &:hover span:not(.lighten) {
        background: var(--color-primary-500);
        color: #fff;
    }
`;

const Span = styled.span`
    display: grid;
    font-size: 11px;
    border-radius: 2px;
    place-content: center;
    transition: all 0.25s;
    grid-column-end: span ${({ span }) => span};
    background: ${({ isActive }) =>
        isActive ? antToken.colorPrimary : '#b9c2ca'};
    color: ${({ isActive }) => (isActive ? '#fff' : antToken.colorTextBase)};
    &.lighten {
        background: #f3f3f3;
    }
`;

/**
 * Renders a list of empty blocks.
 *
 * @param {Object} props - The props of the EmptyBlocks component.
 * @param {boolean} [props.lighten] - Specifies whether the blocks should be lighten
 * @param {string[]} [props.blocks] - An array of string representations of blocks.
 * @param {function} props.onAddBlock - The callback function to be executed when a block is clicked.
 * @param {boolean} [props.showText] - Specifies whether the text should be shown in the blocks.
 * @param {string} [props.selectedBlock] - The selected block that will be used for showing active style
 *
 * @returns {JSX.Element} - The rendered EmptyBlocks component.
 *
 *
 * @example
 * Example usage of EmptyBlocks component
 * const blocks = ["1", "1+1", "1+3"];
 * const onAddBlock = (block) => {
 *   console.log(block);
 * };
 *
 * <EmptyBlocks lighten blocks={blocks} onAddBlock={onAddBlock} showText />
 */
export function EmptyBlocks(props) {
    const { lighten, blocks = [], onAddBlock, showText, selectedBlock } = props;

    return (
        <EmptyBody>
            {blocks.map((block, idx) => {
                const colCount = getColCount(block);
                return (
                    <Block
                        key={idx}
                        col={colCount}
                        onClick={() => onAddBlock(block)}
                        data-testid={`empty-block-${idx}`}
                    >
                        {block.split('+').map((span, colIdx) => {
                            const isLighten = lighten && colIdx > 0;
                            const size = (span / colCount) * 100;
                            return (
                                <Span
                                    span={span}
                                    key={colIdx}
                                    isActive={
                                        adjustFloatSize(size) === selectedBlock
                                    }
                                    className={isLighten ? 'lighten' : null}
                                >
                                    {showText && !isLighten
                                        ? adjustFloatSize(size)
                                        : null}
                                </Span>
                            );
                        })}
                    </Block>
                );
            })}
        </EmptyBody>
    );
}
