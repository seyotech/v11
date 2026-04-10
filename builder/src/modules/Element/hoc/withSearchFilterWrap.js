import { Input } from 'antd';
import debounce from 'lodash.debounce';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Enhances a component with search and filter functionality.
 *
 * @param {React.Component} Component - The base component to be enhanced.
 * @returns {React.Component} - The enhanced component with search and filter capabilities.
 * @typedef {Object} WithSearchFilterProps
 * @property {string} searchVal - The current search value.
 * @property {function} searchFilter - The search filter function.
 * @property {function} sorter - The sorting function.
 *
 * @example
 * // Usage with a component
 * const EnhancedComponent = withSearchFilterWrap(BaseComponent);
 *
 * // EnhancedComponent now has search and filter capabilities
 */
const withSearchFilterWrap = (Component) => {
    const WithSearchFilterWrap = (props) => {
        const [search, setSearch] = useState('');
        const { t } = useTranslation();
        const handleSearch = debounce((e) => setSearch(e.target.value), 500);
        const searchFilter = ({ item, type, searchVal }) => {
            return item[type]?.toLowerCase().includes(searchVal.toLowerCase());
        };
        const sorter = ({ currentItem, type, nextItem }) => {
            return currentItem[type].localeCompare(nextItem[type], 'en', {
                sensitivity: 'base',
            });
        };

        return (
            <>
                <Input.Search
                    size="small"
                    placeholder={t('Search')}
                    onChange={handleSearch}
                    style={{ marginBottom: 12 }}
                />
                <Component
                    {...props}
                    searchVal={search}
                    searchFilter={searchFilter}
                    sorter={sorter}
                />
            </>
        );
    };

    return WithSearchFilterWrap;
};

export default withSearchFilterWrap;
