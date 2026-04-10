/*****************************************************
 * Packages
 ******************************************************/
import { Col, Empty, Flex, Row, Card } from 'antd';
import { useContext } from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import styled from 'styled-components';

/*****************************************************
 * Locals
 ******************************************************/
import { ElementContext } from 'contexts/ElementRenderContext';
import { BuilderContext } from 'contexts/BuilderContext';
import Element from './Element';
import { withSearchFilterWrap } from '../hoc';
import { useTranslation } from 'react-i18next';
import { cmsComponent } from 'constants/cmsData';
import { handleCMSAddress } from 'util/getAddressValue';
import elements from '../data/elements';
import { filterAndSortItems, filterGroup } from '../utils/element';

const CardStc = styled(Card)`
    && {
        border-radius: 4px;
        box-shadow: none;
        width: 100%;
        .ant-card-head {
            color: #0c0a25;
            padding: 0 0 8px 0;
            margin-bottom: 0px;
            font-size: 14px;
            min-height: 0;
        }
        .ant-card-body {
            padding: 8px 0 0 0;
        }
    }
`;

/**
 * Represents a collection of default elements.
 *
 * @param {Object} props - The props for the `ElementCollection` component.
 * @param {string} props.searchVal - value of search input
 * @param {Function} props.searchFilter -to client side filter the elements based on the search value
 * * @param {Function} props.sorter -to sort the elements in alphabetical order
 *
 * @returns {ReactElement} The rendered default elements.
 *
 * @example
 * const searchFilter = ({ item, type: 'title', searchVal })=>{};
 * const sorter = ({ currentItem, type: 'title', nextItem })=>{};
 * <ElementCollection searchFilter={searchFilter} sorter={sorter}/>
 */
const ElementCollection = ({ searchVal, searchFilter, sorter }) => {
    const { page, symbols, editAddress } = useContext(ElementContext);
    const { appName, elementTypes } = useContext(BuilderContext);
    const { t } = useTranslation('builder');
    const cmsRow = handleCMSAddress({
        address: editAddress,
        data: page?.data,
        symbols,
    });

    const filteredCategories = elements
        .filter((element) =>
            filterGroup({ element, elementTypes, cmsRow, appName })
        )
        .map((element) => {
            let items = filterAndSortItems(
                element,
                appName,
                page,
                cmsRow,
                cmsComponent,
                searchVal,
                searchFilter,
                sorter
            );

            if (items.length > 0) {
                return {
                    ...element,
                    items,
                };
            }
        })
        .filter(Boolean);

    return (
        <SimpleBar
            style={{
                maxHeight: 360,
                overflowX: 'hidden',
                marginRight: -26,
                paddingRight: 18,
            }}
        >
            {filteredCategories.length ? (
                <Flex vertical={true} gap="small">
                    {filteredCategories.map((element) => {
                        return (
                            <CardStc
                                key={element.type}
                                title={element.title}
                                bordered={false}
                                data-testid={`${element.title}`}
                            >
                                <Row gutter={[14, 12]}>
                                    {element.items.map((item) => (
                                        <Col key={item.id} span={6}>
                                            <Element
                                                item={item}
                                                canDrag={false}
                                                key={item.title}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </CardStc>
                        );
                    })}
                </Flex>
            ) : (
                <Flex align="center" justify="center" style={{ width: '100%' }}>
                    <Empty description={t('No Element Matched')} />
                </Flex>
            )}
        </SimpleBar>
    );
};

export const ElementCollectionWithSearchFilter =
    withSearchFilterWrap(ElementCollection);
