/*****************************************************
 * Packages
 ******************************************************/
import React from 'react';
import PropTypes from 'prop-types';
import { SelectNative } from './CustomSelect.stc';

export const Option = (props) => {
    const { children, selected, value, handleSelect, disabled } = props;
    // const isActive = value === selected;
    // const handleClick = e => {
    //     e.stopPropagation();
    //     handleSelect(value);
    // };
    return (
        // <OptionEl onClick={handleClick} isActive={isActive}>
        //     {isActive && (
        //         <FontAwesomeIcon className="icon" icon="check" fixedWidth />
        //     )}
        //     {children}
        // </OptionEl>
        <option value={value} disabled={disabled}>
            {children}
        </option>
    );
};

const Select = (props) => {
    const { children, onSelect, name, selected, ...rest } = props;
    // let selectedItem;
    // if (!isArray(children)) {
    //     selectedItem = children.props.value === selected && children.props;
    // }
    // selectedItem = children.find(child => child.props.value === selected);
    // selectedItem = selectedItem
    //     ? selectedItem.props
    //     : { value: '', children: '' };

    // const [isVisible, setVisibility] = useState(false);
    const handleSelect = (e) => {
        e.persist();
        const result = { name, value: e.target.value };
        onSelect && onSelect(result);
        // setVisibility(false);
    };
    return (
        <SelectNative value={selected} onChange={handleSelect} {...rest}>
            {children}
        </SelectNative>
        // <SelectWrap>
        //     <SelectEl
        //         isExpended={isVisible}
        //         onClick={() => setVisibility(!isVisible)}
        //     >
        //         {selectedItem.children}
        //         <FontAwesomeIcon
        //             className="select-arrow"
        //             icon={isVisible ? 'chevron-up' : 'chevron-down'}
        //         />
        //     </SelectEl>
        //     {isVisible && (
        //         <OptionWrap>
        //             {React.Children.map(children, child =>
        //                 React.cloneElement(child, { handleSelect, selected })
        //             )}
        //         </OptionWrap>
        //     )}
        // </SelectWrap>
    );
};

Select.propTypes = {
    onSelect: PropTypes.func,
};

export default React.memo(Select);
