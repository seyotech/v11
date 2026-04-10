import { useState } from 'react';

import RenderComponentWithLabel from 'modules/Shared/settings-components/RenderComponentWithLabel';
import { ColorComponent } from 'modules/setting-components/ColorComponent';
import { Range } from 'modules/setting-components/Range';
import { SelectInput as Select } from 'modules/setting-components/Select';
import { useTranslation } from 'react-i18next';
import { Tabs } from '../../Tabs';
import { Frames } from './Frames';

const cornerOptions = [
    { name: 'Top Left', value: 'top-left' },
    { name: 'Top Right', value: 'top-right' },
    { name: 'Bottom Left', value: 'bottom-left' },
    { name: 'Bottom Right', value: 'bottom-right' },
];

const SectionFrame = (props) => {
    const { value = {}, onChange } = props;
    const [position, setPosition] = useState('top');
    const { t } = useTranslation('builder');
    const [currentFrame, setCurrentFrame] = useState({
        flip: '',
        color: '',
        height: '',
        frameId: '',
        ...value[position],
    });

    const handleChange = ({ name, value: val }) => {
        if (name === 'cornerPosition') {
            const rotateValue = getFilp(val);
            const payload = [
                {
                    name: `frames/${position}/${name}`,
                    value: val,
                },
                {
                    name: `frames/${position}/flip`,
                    value: rotateValue,
                },
            ];
            onChange(payload);
        } else {
            onChange({
                name: `frames/${position}/${name}`,
                value: val,
            });
        }
        setCurrentFrame((frame) => ({ ...frame, [name]: val }));
    };

    const handleSelect = ({ value: position }) => {
        setPosition(position);
        setCurrentFrame((frame) => ({ ...frame, ...value[position] }));
    };

    const isEdited = (position) => {
        if (value && value[position] && value[position].content) {
            return true;
        }
        return false;
    };

    return (
        <>
            <Tabs
                module={{
                    label: t('Position'),
                    labelExtra: true,
                    labelPosition: 'inline',
                }}
                onChange={handleSelect}
                value={position}
                options={[
                    {
                        label: t('Top'),
                        icon: 'far objects-align-top',
                        value: 'top',
                    },
                    {
                        label: t('Bottom'),
                        icon: 'far objects-align-bottom',
                        value: 'bottom',
                    },
                    {
                        label: t('Corner'),
                        icon: 'far border-top-left',
                        value: 'corner',
                    },
                ]}
            />

            <RenderComponentWithLabel label={t('Frame Style')}>
                <Frames
                    position={position}
                    onSelect={handleChange}
                    frameId={currentFrame.frameId}
                />
            </RenderComponentWithLabel>

            {position === 'corner' && (
                <>
                    <Select
                        name="cornerPosition"
                        label={t('Corner Position')}
                        options={cornerOptions}
                        onChange={handleChange}
                        value={currentFrame.cornerPosition || 'top-right'}
                    />
                </>
            )}

            <ColorComponent
                name="color"
                label={t('Color')}
                onChange={handleChange}
                value={currentFrame.color}
            />

            <Range
                name="height"
                value={currentFrame.height}
                onChange={handleChange}
                module={{
                    label: 'Height',
                    max: 500,
                    min: 0,
                    defaultUnit: 'px',
                }}
            />

            {position === 'corner' && (
                <Range
                    name="width"
                    value={currentFrame.width}
                    onChange={handleChange}
                    module={{
                        label: 'Width',
                        max: 500,
                        min: 0,
                        defaultUnit: 'px',
                    }}
                />
            )}

            {position !== 'corner' && (
                <>
                    <Tabs
                        name="flip"
                        className="mt-25"
                        onChange={handleChange}
                        module={{ label: 'Flip' }}
                        value={currentFrame.flip}
                        options={[
                            {
                                value: '',
                                label: t('Default'),
                            },
                            {
                                value: 'rotateY(180deg)',
                                label: t('Horizontal'),
                            },
                        ]}
                    />
                </>
            )}
        </>
    );
};

export default SectionFrame;

function getFilp(value) {
    switch (value) {
        case 'top-left':
            return 'rotateY(180deg)';
        case 'bottom-left':
            return 'rotateX(180deg) rotateY(180deg)';
        case 'bottom-right':
            return 'rotateX(180deg)';
        default:
            return '';
    }
}
