import React, { useState } from 'react';

import Label from './Label/Label';
import RenderTemplate from './core/RenderTemplate';
import Tab, { TabOption } from './reusable/Tab';

const bgModules = {
    color: ['style/backgroundColor'],
    image: [
        'style/backgroundImage/image',
        {
            path: 'style/asdfasdf',
            content: {
                onValue: true,
                onLabel: 'ON',
                offValue: false,
                offLabel: 'OFF',
                template: 'Switch',
                labelPosition: 'inline',
                defaultValue: false,
                label: 'Parallax / Fixed Background',
            },
        },
        'style/backgroundSize',
        'style/backgroundPosition',
        'style/backgroundRepeat',
        'style/backgroundBlendMode',
        'attr/__class__overlayType',
        {
            path: 'pseudoClass/before/backgroundColor',
            conditions: ['attr/__class__overlayType', '===', 'color-overlay'],
            content: {
                template: 'ColorPicker',
            },
        },
    ],
    video: [],
    special: [],
};

const BackgroundStyleGroup = (props) => {
    const [activeState, setState] = useState('color');
    const { currentEditItem, handleChange } = props;

    const handleCategory = ({ value }) => setState(value);

    return (
        <div>
            <Label>Background Styles</Label>
            <Tab
                type="boxed"
                selected={activeState}
                onSelect={handleCategory}
                style={{ marginBottom: '20px' }}
            >
                <TabOption value="color">Color</TabOption>
                <TabOption value="image">Image</TabOption>
                <TabOption
                    title="this options is disabled"
                    isDisabled={true}
                    value="video"
                >
                    Video
                </TabOption>
                <TabOption
                    title="this options is disabled"
                    isDisabled={true}
                    value="special"
                >
                    Special
                </TabOption>
            </Tab>
            {bgModules[activeState].map((mod, index) => (
                <RenderTemplate
                    key={index}
                    module={mod}
                    handleChange={handleChange}
                    currentEditItem={currentEditItem}
                />
            ))}
        </div>
    );
};
export default React.memo(BackgroundStyleGroup);
