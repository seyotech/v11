/*****************************************************
 * Packages
 ******************************************************/
import React, { useState } from 'react';

/*****************************************************
 * Locals
 ******************************************************/
import RenderComponent from './core/RenderComponent';
import getPathValue from '../../util/getPathValue';
import Tab, { TabOption } from './reusable/Tab';
import Label from './Label/Label';
import useEditorModal from '../../hooks/useEditorModal';

const defaultValues = [
    ['width', ''],
    ['style', 'solid'],
    ['color', ''],
];
const borderPositions = [
    { name: 'All', value: '' },
    { name: 'Left', value: 'left' },
    { name: 'Right', value: 'right' },
    { name: 'Top', value: 'top' },
    { name: 'Bottom', value: 'bottom' },
];

function Border(props) {
    const {
        display,
        module,
        activeHover,
        parentModule,
        currentEditItem,
        handleChange: onChange,
    } = props;
    const [lastPosition, setLastPosition] = useState('');
    const { isSidebar } = useEditorModal();
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
    const tabStyle = {
        fontSize: isSidebar ? '12px' : '14px',
        marginBottom: '16px',
    };

    return (
        <>
            <Label>Border Position</Label>
            <Tab
                type="boxed"
                style={tabStyle}
                selected={lastPosition}
                onSelect={({ value }) => setLastPosition(value)}
            >
                {borderPositions.map((pos, index) => (
                    <TabOption
                        key={index}
                        value={pos.value}
                        isEdited={isEdited(pos.value)}
                    >
                        {pos.name}
                    </TabOption>
                ))}
            </Tab>

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

export default React.memo(Border);
