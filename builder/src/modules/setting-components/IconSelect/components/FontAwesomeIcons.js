/*****************************************************
 * Packages
 ******************************************************/
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import PropType from 'prop-types';

/*****************************************************
 * Locals
 ******************************************************/
import { ICON_TYPES } from '../constants';
import { IconProvider } from '../context/IconProvider';
import { IconPack } from './IconPack';

library.add(fas);
library.add(fab);
library.add(far);

const icons = Object.values(far)
    .concat(Object.values(fas))
    .concat(Object.values(fab));

const FontAwesomeIcons = (props) => {
    return (
        <IconProvider {...props} icons={icons} type={ICON_TYPES.FONT_AWESOME}>
            <IconPack size={props.size} />
        </IconProvider>
    );
};

FontAwesomeIcons.propTypes = {
    value: PropType.string.isRequired,
    onSelect: PropType.func.isRequired,
    pathName: PropType.string.isRequired,
    size: PropType.string.isRequired,
};

export default FontAwesomeIcons;
