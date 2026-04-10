/*****************************************************
 * Packages
 ******************************************************/
import { icons } from 'feather-icons';
import PropType from 'prop-types';

/*****************************************************
 * Locals
 ******************************************************/
import { ICON_TYPES } from '../constants';
import { IconProvider } from '../context/IconProvider';
import { IconPack } from './IconPack';

const FeatherIcons = (props) => {
    return (
        <IconProvider
            {...props}
            icons={icons}
            prefix={ICON_TYPES.FEATHER}
            type={ICON_TYPES.FEATHER}
        >
            <IconPack size={props.size} />
        </IconProvider>
    );
};

FeatherIcons.propTypes = {
    value: PropType.string.isRequired,
    onSelect: PropType.func.isRequired,
    pathName: PropType.string.isRequired,
    size: PropType.string.isRequired,
};

export default FeatherIcons;
