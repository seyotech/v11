/*****************************************************
 * Packages
 ******************************************************/
import { useState } from 'react';

/*****************************************************
 * Locals
 ******************************************************/
import { useTranslation } from 'react-i18next';
import RenderComponent from '../../../../components/setting-components/core/RenderComponent';
import getPathValue from '../../../../util/getPathValue';
import { Tabs } from './Tabs';

const defaultValues = [
    ['width', ''],
    ['style', 'solid'],
    ['color', ''],
];

/**
 * Renders a tabbed interface for editing border styles.
 * @param {Object} props - The props object.
 * @param {string} props.display - The display mode of the component.
 * @param {Object} props.module - The module configuration for rendering child components.
 * @param {boolean} props.activeHover - Indicates whether the hover pseudo-class is active.
 * @param {Object} props.parentModule - The parent module configuration.
 * @param {Object} props.currentEditItem - The currently edited item.
 * @param {function} props.handleChange - A callback function for handling changes.
 * @returns {JSX.Element} - The rendered JSX elements representing the tabbed interface for editing border styles.
 */
export function BorderTab(props) {
    const {
        display,
        module,
        activeHover,
        parentModule,
        currentEditItem,
        handleChange: onChange,
    } = props;
    const [lastPosition, setLastPosition] = useState('');
    const { t } = useTranslation('builder');
    let path = 'style/border';
    if (activeHover) {
        path = `pseudoClass/hover/${path}`;
    }
    if (display !== 'desktop') {
        path = `media/${display}/${path}`;
    }
    const value = getPathValue(path, currentEditItem);
    const borderMap = new Map(value || defaultValues);

    const getValue = (key) => {
        const mapKey = (lastPosition && `${lastPosition}-`) + key;
        return borderMap.get(mapKey);
    };

    const handleChange = ({ name, value }) => {
        const mapKey = (lastPosition && `${lastPosition}-`) + name;
        borderMap.set(mapKey, value);
        onChange({ name: path, value: [...borderMap] });
    };

    const isEdited = (pos) => {
        if (pos) {
            let result = false;
            const types = defaultValues.map((item) => item[0]);
            for (let type of types) {
                const typeValue = borderMap.get(`${pos}-${type}`);
                if (typeValue && borderMap.get(type) !== typeValue) {
                    return true;
                }
            }
            return result;
        }
    };
    const handleSelect = ({ name, value }) => {
        setLastPosition(value);
    };

    return (
        <>
            <Tabs
                module={{
                    label: t('Position'),
                    labelPosition: 'inline',
                }}
                onChange={handleSelect}
                value={lastPosition}
                options={[
                    { label: t('All'), value: '', icon: 'far border-outer' },
                    {
                        label: t('Left'),
                        value: 'left',
                        icon: 'far border-left',
                    },
                    {
                        label: t('Right'),
                        value: 'right',
                        icon: 'far border-right',
                    },
                    { label: t('Top'), value: 'top', icon: 'far border-top' },
                    {
                        label: t('Bottom'),
                        value: 'bottom',
                        icon: 'far border-bottom',
                    },
                ]}
            />

            {module.modules.map((mod, i) => (
                <RenderComponent
                    key={i}
                    module={mod}
                    path={mod.path}
                    display={display}
                    onChange={handleChange}
                    activeHover={activeHover}
                    value={getValue(mod.path)}
                    parentModule={parentModule}
                />
            ))}
        </>
    );
}
