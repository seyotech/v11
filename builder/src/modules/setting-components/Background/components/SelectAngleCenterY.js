/*****************************************************
 * Locals
 ******************************************************/
import { Range } from 'modules/setting-components/Range';
import { useTranslation } from 'react-i18next';
import { isLinearType } from '../utils/bg-utils';

/**
 * Renders a component to select the angle's center y position based on the given type.
 * If the type is linear, the component will not be rendered.
 *
 * @param {Object} props - The props object.
 * @param {string} props.type - The type of the angle.
 * @param {number} props.centerY - The current center y position of the angle.
 * @param {Function} props.onSelect - The callback function invoked when the center y position is selected.
 *
 * @returns {JSX.Element | null} - The component to select the angle's center y position or null if the type is linear.
 *
 */
const SelectAngleCenterY = ({ type, centerY, onSelect }) => {
    const { t } = useTranslation('builder');
    if (!isLinearType(type)) {
        return (
            <Range
                max={200}
                min={-100}
                defaultUnit="%"
                value={centerY}
                labelWidth="70px"
                defaultValue="50%"
                onChange={onSelect}
                name="select-center-y"
                module={{ label: t('Center Y') }}
            />
        );
    }
    return null;
};

export default SelectAngleCenterY;
