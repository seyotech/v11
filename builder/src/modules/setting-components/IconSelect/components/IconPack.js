/*****************************************************
 * Packages
 ******************************************************/
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import isEqual from 'lodash.isequal';
import PropType from 'prop-types';

/*****************************************************
 * Locals
 ******************************************************/
import { useTranslation } from 'react-i18next';
import { ICON_SIZES, NUM_COLUMNS, NUM_ROWS, PADDING_SIZE } from '../constants';
import { useIcons } from '../hooks';
import { IconList } from './IconList';
import { Search, Wrapper } from './IconSelect.stc';

export const IconPack = ({ size }) => {
    const { filteredIcons = [], setSearchTerm, value } = useIcons();
    const { t } = useTranslation('builder');
    const ICON_SIZE = (ICON_SIZES[size] - PADDING_SIZE * 2) / NUM_COLUMNS;
    const iconIndex = filteredIcons.findIndex((icon) =>
        isEqual(icon?.value, value)
    );

    const getSelectedIconPosition = () => {
        if (iconIndex < NUM_COLUMNS * NUM_ROWS) return {};
        return {
            columnIndex: Math.floor(iconIndex / NUM_ROWS),
            rowIndex: Math.floor(iconIndex / NUM_COLUMNS),
        };
    };

    return (
        <Wrapper>
            <Search>
                <input
                    placeholder={t('Search Icons')}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
                <FontAwesomeIcon
                    icon={icon({ name: 'search', type: 'solid' })}
                />
            </Search>

            <IconList
                rowHeight={ICON_SIZE}
                columnWidth={ICON_SIZE}
                columnCount={NUM_COLUMNS}
                height={ICON_SIZE * NUM_ROWS + 6}
                position={getSelectedIconPosition()}
                width={ICON_SIZE * NUM_COLUMNS + PADDING_SIZE * 2}
                rowCount={Math.ceil(filteredIcons.length / NUM_COLUMNS) ?? 1}
            />
        </Wrapper>
    );
};

IconPack.propTypes = {
    size: PropType.string.isRequired,
};
