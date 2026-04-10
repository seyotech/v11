/*****************************************************
 * Packages
 ******************************************************/
import { useContext, useMemo } from 'react';
import { Col, Empty, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { ElementContext } from 'contexts/ElementRenderContext';

/*****************************************************
 * Locals
 ******************************************************/
import LibraryCard from './LibraryCard';
import { withSearchFilterWrap } from 'modules/Element/hoc';
import { hasContainerSymbolInLayer } from 'util/dndHelpers';
import { EL_TYPES } from '../../../constants/index';

/**
 * Represents a collection of symbols.
 *
 * @param {Object} props - The props for the `GlobalSymbol` component.
 * @param {string} props.searchVal - value of search input
 * @param {Function} props.searchFilter -to client side filter the symbols based on the search value
 * * @param {function} props.sorter -to sort the symbols in alphabetical order
 *
 * @returns {ReactElement} The rendered symbols based on type.
 *
 * @example
 * const searchVal='button'
 * const type= 'section'
 * const searchFilter = ({ item, type: 'title', searchVal })=>{};
 * const sorter = ({ currentItem, type: 'title', nextItem })=>{};
 * <GlobalSymbol type={type} searchVal={searchVal} searchFilter={searchFilter} sorter={sorter}/>
 */
function GlobalSymbol({ type, searchVal, searchFilter, sorter }) {
    const { t } = useTranslation('builder');
    const {
        symbols = {},
        getDataByAddress,
        editAddress,
    } = useContext(ElementContext);
    const currentEditItem = getDataByAddress(editAddress);

    let symbolsByType = Object.values(symbols).filter((symbol) => {
        return symbol.data._elType === EL_TYPES.CMSROW
            ? type === EL_TYPES.ROW
            : symbol.data._elType === type;
    });
    if (type === EL_TYPES.CONTAINER) {
        symbolsByType = symbolsByType.filter((symbol) => {
            return !hasContainerSymbolInLayer({
                getDataByAddress,
                targetItem: {
                    address: editAddress,
                    ...(currentEditItem.type === 'container' && {
                        symbolId: currentEditItem.symbolId,
                    }),
                },
                sourceItem: { info: { data: { symbolId: symbol.id } } },
            });
        });
    }

    const filteredSymbols = symbolsByType
        .filter((item) => searchFilter({ item, type: 'name', searchVal }))
        .sort((currentItem, nextItem) =>
            sorter({ currentItem, type: 'name', nextItem })
        );

    if (!symbolsByType.length) {
        return <Empty description={t('No data available')} />;
    }

    return (
        <SimpleBar style={{ height: 350, overflowX: 'hidden' }}>
            <Row gutter={[12, 12]}>
                {filteredSymbols.map(({ id, thumbnail, name }) => {
                    return (
                        <Col key={id} span={12}>
                            <LibraryCard
                                placement="top"
                                canDrag={false}
                                component={{
                                    id,
                                    thumbnail: thumbnail,
                                    type,
                                    data: { symbolId: id },
                                    title: name,
                                }}
                                overlayStyle={{ width: 300 }}
                            />
                        </Col>
                    );
                })}
            </Row>
        </SimpleBar>
    );
}

export default withSearchFilterWrap(GlobalSymbol);
