/*****************************************************
 * Packages
 ******************************************************/
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import isEqual from 'lodash.isequal';
import PropType from 'prop-types';

/*****************************************************
 * Locals
 ******************************************************/
import { ICON_TYPES, NUM_COLUMNS, PADDING_SIZE } from '../constants';
import { useIcons } from '../hooks';
import { IconStc } from './IconSelect.stc';

export const Cell = ({ columnIndex, rowIndex, style }) => {
    const { filteredIcons, onSelect, pathName: name, value, type } = useIcons();

    const icon = filteredIcons[rowIndex * NUM_COLUMNS + columnIndex];
    const isSelected = isEqual(icon?.value, value);

    if (!icon) {
        return null;
    }

    return (
        <IconStc
            key={icon.name}
            isSelected={isSelected}
            style={{
                ...style,
                top: `${parseFloat(style.top) + 4}px`,
                left: `${parseFloat(style.left) + PADDING_SIZE}px`,
            }}
            onClick={() => onSelect({ name, value: icon.value })}
        >
            {type === ICON_TYPES.FONT_AWESOME ? (
                <FontAwesomeIcon
                    icon={[icon.prefix, icon.iconName]}
                    data-testid={`fa-${icon.iconName}`}
                    className={isSelected ? 'selected' : ''}
                />
            ) : (
                <svg
                    fill="none"
                    width={16}
                    height={16}
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    data-testid={`fi-${icon.name}`}
                    dangerouslySetInnerHTML={{ __html: icon.contents }}
                    className={isSelected ? 'selected' : ''}
                />
            )}
        </IconStc>
    );
};

Cell.propTypes = {
    style: PropType.object.isRequired,
    rowIndex: PropType.number.isRequired,
    columnIndex: PropType.number.isRequired,
};
