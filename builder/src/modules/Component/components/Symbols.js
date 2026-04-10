/*****************************************************
 * Packages
 ******************************************************/
import { Col, Empty, Row, Typography } from 'antd';
import { useContext, useMemo, useState } from 'react';

/*****************************************************
 * Locals
 ******************************************************/
import { ElementContext } from 'contexts/ElementRenderContext';
import AntCollapse from 'modules/Shared/AntCollapse';
import { useTranslation } from 'react-i18next';
import LibraryCard from './LibraryCard';
import { EL_TYPES } from '../../../constants/index';

/**
 * @typedef {'SECTION' | 'ROW' | 'COLUMN' | 'ELEMENT'|'CONTAINER'} types
 */
/**
 * @component
 * @example
 * // Example usage of Children component
 * <Children type='SECTION'/>
 * @param {Object} props - The component's props.
 * @param {types} props.type- symbol type
 *
 * @returns {JSX.Element}
 */

function Children({ type }) {
    const { symbols = {} } = useContext(ElementContext);
    const { t } = useTranslation('builder');

    const symbolsByType = useMemo(() => {
        return Object.values(symbols).filter((symbol) => {
            return symbol.data._elType === EL_TYPES.CMSROW
                ? type === EL_TYPES.ROW
                : symbol.data._elType === type;
        });
    }, [symbols, type]);

    if (!symbolsByType.length) {
        return <Empty description={t('No data available')} />;
    }

    return (
        <Row gutter={[12, 12]}>
            {symbolsByType.map(({ id, thumbnail, name, data }) => (
                <Col key={id} span={24} style={{ position: 'relative' }}>
                    <LibraryCard
                        component={{
                            id,
                            thumbnail,
                            type: data._elType,
                            title: name,
                            data: { symbolId: id },
                        }}
                        tag={type}
                    />
                </Col>
            ))}
        </Row>
    );
}

/**
 * @component
 * @example
 * // Example usage of Symbols component
 * <Symbols/>
 * @returns {JSX.Element} renders symbols
 */

function Symbols() {
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [lastKey, setLastKey] = useState(null);

    const symbolsInfo = [
        { type: 'SECTION' },
        { type: 'ROW' },
        { type: 'COLUMN' },
        { type: 'ELEMENT' },
        { type: 'CONTAINER' },
    ];

    const handleExpandedKeys = (nextActiveKeys) => {
        const lastKey = nextActiveKeys.at(-1);
        if (lastKey && !expandedKeys.includes(lastKey)) {
            setLastKey(lastKey);
            setExpandedKeys((prev) => [...prev, lastKey]);
        }
    };

    const items = symbolsInfo.map(({ type }) => {
        return {
            key: type,
            children: (
                <Children
                    {...{
                        type,
                    }}
                />
            ),
            label: <Typography.Text>{type}</Typography.Text>,
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

export default Symbols;
