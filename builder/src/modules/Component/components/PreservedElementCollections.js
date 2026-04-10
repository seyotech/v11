/*****************************************************
 * Packages
 ******************************************************/
import { Col, Empty, Row, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

/*****************************************************
 * Locals
 ******************************************************/
import LibraryCard from './LibraryCard';

/**
 * Renders a collection of preserved elements.
 *
 * @param {Object} elements - An array of preserved elements to render.
 * @param {boolean} isFetching - Indicates if data is currently being fetched.
 * * @param {Function} handleDeleteElement - to delete a specific type of saved element
 *
 * @returns {JSX.Element} - The rendered collection of preserved elements.
 *
 * @example
 * // Elements array contains elements, isFetching is false
 * const preservedElements = [{ id: 1, name: "Element 1" }, { id: 2, name: "Element 2" }];
 * const fetching = false;
 * const component = <PreservedElementCollections elements={preservedElements} isFetching={fetching} />;
 */
export const PreservedElementCollections = ({
    elements,
    isFetching,
    handleDeleteElement,
}) => {
    const { t } = useTranslation('builder');

    if (!elements.length && !isFetching) {
        return <Empty description={t('No data available')} />;
    }

    return (
        <Spin spinning={isFetching}>
            <SimpleBar style={{ height: 350, overflowX: 'hidden' }}>
                <Row gutter={[12, 12]}>
                    {elements.map((element) => {
                        return (
                            <Col key={element.id} span={12}>
                                <LibraryCard
                                    placement="top"
                                    canDrag={false}
                                    component={element}
                                    overlayStyle={{ width: 300 }}
                                    isProvided={true}
                                    handleDeleteElement={handleDeleteElement}
                                />
                            </Col>
                        );
                    })}
                </Row>
            </SimpleBar>
        </Spin>
    );
};
