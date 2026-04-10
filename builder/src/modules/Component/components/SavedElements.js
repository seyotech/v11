/*****************************************************
 * Packages
 ******************************************************/
import { Col, Empty, Row, Spin, Typography } from 'antd';
import { useContext, useState } from 'react';

/*****************************************************
 * Locals
 ******************************************************/
import { BuilderContext } from 'contexts/BuilderContext';
import AntCollapse from 'modules/Shared/AntCollapse';
import { useTranslation } from 'react-i18next';
import ucFirst from 'util/ucFirst';
import LibraryCard from './LibraryCard';

/**
 * @typedef {'SECTION' | 'ROW' | 'COLUMN' | 'ELEMENT'} types
 */
/**
 * @component
 * @example
 * // Example usage of Children component
 * <Children type='SECTION'  isLoading={true} savedElements={[{id:'d23rewd',thumbnail:'example.type',type:'SECTION'}]}/>
 * @param {Object} props - The component's props.
 * @param {types} props.type
 * @param {Boolean} props.isLoading - Whether to show loading indicator.
 * @param {Function} props.getVisibleElements -to get specific  type saved element
 * * @param {Function} props.handleDeleteElement -to delete specific  type saved element
 *
 * @returns {JSX.Element}
 */

function Children({
    type,
    isLoading,
    cacheKey,
    getVisibleElements,
    handleDeleteElement,
    canDrag,
}) {
    const savedElements = getVisibleElements(cacheKey);
    const { t } = useTranslation('builder');

    if (!savedElements.length && !isLoading) {
        return <Empty description={t('No data available')} />;
    }

    return (
        <Spin size="small" spinning={isLoading}>
            <Row gutter={[12, 12]}>
                {savedElements.map((component) => (
                    <Col key={component.id} span={24}>
                        <LibraryCard
                            component={component}
                            tag={type}
                            isProvided={true}
                            handleDeleteElement={handleDeleteElement}
                            canDrag={canDrag}
                        />
                    </Col>
                ))}
            </Row>
        </Spin>
    );
}

/**
 * @component
 * @example
 * // Example usage of SavedElements component
 * <SavedElements shouldRender={true}/>
 *
 * @param {Object} props - The component's props.
 * @param {Boolean} props.shouldRender - Whether to render the content or not.
 *
 * @returns {JSX.Element | null} The rendered content or null based on the `shouldRender` prop.
 */

function SavedElements({ shouldRender }) {
    const { t } = useTranslation('builder');
    const { getSavedElements, isFetching, getVisibleElements, removeElement } =
        useContext(BuilderContext);
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [listKey, setListKey] = useState(null);

    //return early to avoid calculations
    if (!shouldRender) {
        return null;
    }

    const elementsInfo = [
        { type: 'SECTION', cacheKey: 'savedSections' },
        { type: 'ROW', cacheKey: 'savedRows' },
        { type: 'COLUMN', cacheKey: 'savedColumns' },
        { type: 'ELEMENT', cacheKey: 'savedElements' },
        { type: 'CONTAINER', cacheKey: 'savedContainers' },
    ];

    const handleExpandedKeys = (nextActiveKeys) => {
        const lastKey = nextActiveKeys.at(-1);
        if (lastKey && !expandedKeys.includes(lastKey)) {
            const listKey = `saved${ucFirst(lastKey)}s`;
            getSavedElements(lastKey, listKey);
            setListKey(listKey);
            setExpandedKeys((prev) => [...prev, lastKey]);
        }
    };

    const handleDeleteElement = async (id, type) => {
        const deleted = await removeElement(id, type);
        if (deleted) {
            const elementKey = `saved${ucFirst(type)}s`;
            getSavedElements(type, elementKey);
            setListKey(elementKey);
        }
    };

    const items = elementsInfo.map(({ type, cacheKey }) => {
        return {
            key: type,
            children: (
                <Children
                    {...{
                        type,
                        cacheKey,
                        getVisibleElements,
                        handleDeleteElement,
                        isLoading: isFetching && listKey === cacheKey,
                    }}
                />
            ),
            label: <Typography.Text>{t(type)}</Typography.Text>,
        };
    });

    return (
        <AntCollapse
            items={items}
            showArrow={false}
            defaultActiveKey={[]}
            onChange={handleExpandedKeys}
        />
    );
}

export default SavedElements;
