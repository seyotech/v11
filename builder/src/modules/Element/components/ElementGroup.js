import { Space } from 'antd';
import AntCollapse from 'modules/Shared/AntCollapse';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { filterLagacyElement } from '../utils/element';
import Element from './Element';

const ElementGroup = ({ items, canDrag }) => {
    const { t } = useTranslation('builder');
    const generateCollapseItems = ({ items }) => {
        return filterLagacyElement(items).map((groupItem, index) => ({
            key: index,
            label: t(`{{title}} {{length}}`, {
                title: groupItem.title,
                length: `(${groupItem.items.length})`,
            }),
            children: (
                <Space size={12} wrap={true}>
                    {groupItem.items.map((item) => (
                        <Element
                            key={item.title}
                            item={item}
                            canDrag={canDrag}
                        />
                    ))}
                </Space>
            ),
        }));
    };

    return (
        <AntCollapse
            defaultActiveKey={['0']}
            items={generateCollapseItems({ items })}
        />
    );
};

ElementGroup.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            items: PropTypes.arrayOf(
                PropTypes.shape({
                    icon: PropTypes.oneOfType([
                        PropTypes.object,
                        PropTypes.func,
                    ]).isRequired,
                    title: PropTypes.string.isRequired,
                    data: PropTypes.object,
                    membership: PropTypes.array,
                    badgeText: PropTypes.string,
                }).isRequired
            ).isRequired,
        })
    ).isRequired,
};

export default ElementGroup;
