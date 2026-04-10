import React, { useContext } from 'react';
import styled from 'styled-components';
import { ElementContext } from '../../../../contexts/ElementRenderContext';
import uuid from '../../../../util/uniqId';
import Alert from '../../../Alert';
import { Body } from './AddSectionModal.stc';
import { searchFilter } from './utils';

const Section = styled(Body)`
    gap: 20px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
`;
const Img = styled.img`
    width: 100%;
    display: block;
    border-radius: 5px;
`;

const ItemWrap = styled.div``;

const Item = styled.div`
    cursor: pointer;
    position: relative;
    border-radius: 5px;
`;

const RemoveWrap = styled.div`
    top: 10px;
    z-index: 2;
    right: 10px;
    position: absolute;
`;

const Remove = styled.span`
    width: 30px;
    height: 30px;
    font-size: 14px;
    background: #fff;
    border-radius: 5px;
    align-items: center;
    display: inline-flex;
    justify-content: center;

    svg {
        color: var(--color-danger-500);
    }
`;

const Desc = styled.div`
    top: 0;
    left: 0;
    color: #fff;
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 5px;
    background-image: linear-gradient(
        to bottom,
        transparent,
        rgba(0, 0, 0, 0.8)
    );
`;

const Text = styled.p`
    bottom: 0;
    color: #ffffff;
    margin: 20px;
    position: absolute;
`;

function Element({ element, addElement }) {
    const handleAddSymbol = React.useCallback(() => {
        addElement({
            data: { symbolId: element.id, id: uuid() },
            elType: element.data._elType,
        });
    }, [addElement, element.data._elType, element.id]);
    return (
        <ItemWrap>
            <Item>
                <div title="Click to Add" onClick={handleAddSymbol}>
                    <Img
                        src={
                            element.thumbnail ||
                            '/assets/images/image-placeholder.jpg'
                        }
                        alt=""
                    />

                    <Desc>
                        <Text>{element.name}</Text>
                    </Desc>
                </div>
            </Item>
        </ItemWrap>
    );
}

function GlobalSymbol({ searchVal = '', type, ...restOfProps }) {
    const { symbols = {} } = useContext(ElementContext);

    const symbolsByType = React.useMemo(() => {
        return Object.values(symbols).filter(
            (symbol) => symbol.data._elType === type
        );
    }, [symbols, type]);

    if (!symbolsByType.length) {
        return (
            <div>
                <Alert>No items found!</Alert>
            </div>
        );
    }

    const filteredSymbols = symbolsByType.filter((item) =>
        searchFilter({ item, type: 'name', searchVal })
    );

    return (
        <Section colSize={4}>
            {filteredSymbols.map((symbol, idx) => (
                <Element element={symbol} key={idx} {...restOfProps} />
            ))}
        </Section>
    );
}

export default React.memo(GlobalSymbol);
