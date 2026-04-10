/*****************************************************
 * Packages
 ******************************************************/
import PropType from 'prop-types';
import { useEffect } from 'react';

/*****************************************************
 * Locals
 ******************************************************/
import { ICON_TYPES } from '../constants';
import FeatherIcons from './FeatherIcons';
import FontAwesomeIcons from './FontAwesomeIcons';

const IconSelect = ({
    name,
    value,
    onChange,
    defaultIcon,
    size = 'default',
}) => {
    const pathName = `${name}/icon`;
    const iconPack = value?.visible ?? ICON_TYPES.FONT_AWESOME;

    const Icon = {
        [ICON_TYPES.FEATHER]: FeatherIcons,
        [ICON_TYPES.FONT_AWESOME]: FontAwesomeIcons,
    }[iconPack];

    useEffect(() => {
        if (iconPack === 'none') {
            onChange({
                name: pathName,
                value: null,
            });
        } else if (defaultIcon && !value) {
            onChange({
                name: pathName,
                value: defaultIcon,
            });
        }
    }, [iconPack]);

    if (iconPack === 'none' || iconPack === 'simple') {
        return null;
    }
    return (
        <Icon
            size={size}
            pathName={pathName}
            value={value?.icon}
            onSelect={onChange}
        />
    );
};

FeatherIcons.propTypes = {
    name: PropType.string.isRequired,
    value: PropType.string.isRequired,
    onChange: PropType.func.isRequired,
    size: PropType.string,
};

export default IconSelect;
