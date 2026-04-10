/*****************************************************
 * Locals
 ******************************************************/
import { Range } from 'modules/setting-components/Range';
import { useTranslation } from 'react-i18next';
import { isLinearType } from '../utils/bg-utils';

/**
 * Renders a component that allows the user to select the center X value for an angle.
 * If the angle type is linear, the component is not rendered.
 *
 * @param {Object} props - The component's props.
 * @param {string} props.type - The type of the angle.
 * @param {number} props.centerX - The current center X value of the angle.
 * @param {function} props.onSelect - The callback function to be called when the center X value is selected.
 *
 * @returns {React.Component} - The rendered component to select the center X value for the angle, or null if the angle type is linear.
 *
 * @example
 *
 * // Usage example:
 * <SelectAngleCenterX type="radial" centerX={50} onSelect={handleSelect} />
 */
const SelectAngleCenterX = ({ type, centerX, onSelect }) => {
    const { t } = useTranslation('builder');
    if (!isLinearType(type)) {
        return (
            <Range
                max={200}
                min={-100}
                defaultUnit="%"
                value={centerX}
                label={t('Center X')}
                defaultValue="50%"
                onChange={onSelect}
                name="select-center-x"
                module={{ label: t('Center X') }}
            />
        );
    }
    return null;
};

export default SelectAngleCenterX;
