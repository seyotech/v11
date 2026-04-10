import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import useEditorModal from '../../../hooks/useEditorModal';
import { TabWrap, Option } from './Tabs.stc';
/**
 * @typedef {Object} Props
 * @property {string | bool} value
 * @property {string} [title]
 * @property {boolean} [isEdited]
 * @property {boolean} [isDisabled]
 *
 * @param {Props} param0
 */
export const TabOption = React.memo(function TabOption(props) {
    const {
        icon,
        type,
        title,
        name,
        value,
        selected,
        isEdited,
        onSelect,
        children,
        isDisabled,
    } = props;
    const withIcon = icon && children ? true : false;
    const iconStyle = {
        marginRight: '10px',
    };
    const handleSelect = () => !isDisabled && onSelect({ name, value });

    return (
        <Option
            // theme={{ primary, bodyText, inputBorder }}
            isActive={selected === value}
            isDisabled={isDisabled}
            onClick={handleSelect}
            isEdited={isEdited}
            title={title}
            type={type}
        >
            {icon && (
                <FontAwesomeIcon
                    fixedWidth
                    icon={icon}
                    style={withIcon ? iconStyle : null}
                />
            )}
            {children}
        </Option>
    );
});

/**
 * @typedef {Object} Props
 * @property {string | bool} selected
 * @property {function} onSelect
 * @property {string} [height]
 * @property {string} [type]
 * @property {string} name
 *
 * @param {Props} props
 */
const Tab = (props) => {
    const {
        className,
        children,
        onSelect,
        selected,
        height,
        name,
        width,
        style,
        type,
    } = props;
    const { isSidebar } = useEditorModal();
    return (
        <TabWrap
            type={type}
            style={style}
            width={width}
            className={className}
            isSidebar={isSidebar}
            height={isSidebar ? '26px' : height}
        >
            {React.Children.map(children, (child) =>
                React.cloneElement(child, {
                    onSelect,
                    selected,
                    type,
                    name,
                })
            )}
        </TabWrap>
    );
};

Tab.propTypes = {
    onSelect: PropTypes.func.isRequired,
    selected: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
};

export default React.memo(Tab);
