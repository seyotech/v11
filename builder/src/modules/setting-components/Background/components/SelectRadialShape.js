/*****************************************************
 * Locals
 ******************************************************/
import { Tabs } from 'modules/setting-components/Tabs';
import { useTranslation } from 'react-i18next';
import { isRadialType } from '../utils/bg-utils';

/**
 * Selects a radial shape from a list of options.
 * @function SelectRadialShape
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.type - The type of the shape.
 * @param {string} props.shape - The currently selected shape.
 * @param {function} props.onSelect - The function to call when a shape is selected.
 * @returns {JSX.Element|null} - The JSX element representing the component or null if not a radial type.
 * @throws {Error} - If the type parameter is invalid.
 * @example
 * const shapeType = "radial";
 * const shape = "circle at";
 * const handleShapeSelect = (selectedShape) => {
 *   console.log(selectedShape);
 * };
 *
 * <SelectRadialShape type={shapeType} shape={shape} onSelect={handleShapeSelect} />;
 */
const SelectRadialShape = ({ type, shape, onSelect }) => {
    const { t } = useTranslation('builder');
    if (isRadialType(type)) {
        return (
            <Tabs
                label={t('Radial Shape')}
                type="boxed"
                defaultValue={shape}
                onChange={onSelect}
                options={[
                    {
                        label: t('Circle'),
                        value: 'circle at',
                    },
                    {
                        label: t('Ellipse'),
                        value: 'ellipse at',
                    },
                ]}
            />
        );
    }

    return null;
};

export default SelectRadialShape;
