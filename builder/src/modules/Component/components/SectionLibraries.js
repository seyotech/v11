/*****************************************************
 * Packages
 ******************************************************/
import { Col, Empty, Row, Spin, Typography } from 'antd';
import { useContext, useEffect, useState } from 'react';
/*****************************************************
 * Locals
 ******************************************************/
import { BuilderContext } from 'contexts/BuilderContext';
import AntCollapse from 'modules/Shared/AntCollapse';
import { useTranslation } from 'react-i18next';
import { getFormattedLibraryData } from '../utils';
import LibraryCard from './LibraryCard';

/**
 * @component
 * @example
 * // Example usage of SectionLibraries component
 * <SectionLibraries shouldRender={true}/>
 *
 * @param {Object} props - The component's props.
 * @param {Boolean} props.shouldRender - Whether to render the content or not.
 *
 * @returns {JSX.Element | null} The rendered content or null based on the `shouldRender` prop.
 */

function SectionLibraries({ shouldRender }) {
    const { getElements, isFetching, getVisibleElements } =
        useContext(BuilderContext);
    const [shouldFetch, setShouldFetch] = useState(true);
    const { t } = useTranslation('builder');

    useEffect(() => {
        if (shouldFetch && shouldRender) {
            getElements('SECTION', 'providedSections');
            setShouldFetch(false);
        }
    }, [shouldFetch, shouldRender]);

    //return early to avoid calculations
    if (!shouldRender) {
        return null;
    }

    const sectionLibraries = getVisibleElements('providedSections') || [];

    const sectionLibraryData = getFormattedLibraryData(sectionLibraries);

    const items = sectionLibraryData.map(({ title, components }, index) => {
        return {
            key: index,
            children: (
                <Row gutter={[12, 12]}>
                    {components?.map((component) => (
                        <Col key={component.id} span={24}>
                            <LibraryCard component={component} tag={title} />
                        </Col>
                    ))}
                </Row>
            ),
            label: <Typography.Text>{title}</Typography.Text>,
        };
    });

    if (!items.length && !isFetching) {
        return <Empty description={t('No data available')} />;
    }

    return (
        <Spin size="small" spinning={isFetching} style={{ minHeight: '85vh' }}>
            <AntCollapse
                items={items}
                showArrow={false}
                defaultActiveKey={[]}
            />
        </Spin>
    );
}

export default SectionLibraries;
