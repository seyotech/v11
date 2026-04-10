import React, { useState } from 'react';

import { SelectInput } from '../../modules/setting-components/Select';
import sectionFrames from '../editor-resources/section-frames';
import ColorPicker from './ColorPicker/ColorPicker';
import Label from './Label/Label';
import Range from './Range';
import IconFilter, { Option as IconOption } from './reusable/IconFilter';
import Tab, { TabOption } from './reusable/Tab';

const cornerOptions = [
    { name: 'Top Left', value: 'top-left' },
    { name: 'Top Right', value: 'top-right' },
    { name: 'Bottom Left', value: 'bottom-left' },
    { name: 'Bottom Right', value: 'bottom-right' },
];

const SectionFrame = (props) => {
    const { value, onChange } = props;
    const [lastPosition, setLastPosition] = useState('top');
    const [frames, setFrames] = useState(sectionFrames);
    const lastPosFrames = frames.filter(
        (frame) => frame.position === lastPosition
    );
    let lastPosValue = {
        flip: '',
        color: '',
        height: '',
        frameId: '',
    };

    if (value && value[lastPosition]) {
        lastPosValue = {
            ...lastPosValue,
            ...value[lastPosition],
        };
    }

    const handleFilter = (payload) => {
        const frames = sectionFrames.filter((frame) => {
            if (!payload.value) return true;
            if (!frame.tags) return false;
            return frame.tags.includes(payload.value);
        });
        setFrames(frames);
    };

    const handleChange = ({ name, value: val }) => {
        if (name === 'cornerPosition') {
            const rotateValue = getFilp(val);
            const payload = [
                {
                    name: `frames/${lastPosition}/${name}`,
                    value: val,
                },
                {
                    name: `frames/${lastPosition}/flip`,
                    value: rotateValue,
                },
            ];
            onChange(payload);
        } else {
            onChange({
                name: `frames/${lastPosition}/${name}`,
                value: val,
            });
        }
    };

    const handleSelect = ({ value }) => {
        setLastPosition(value);
    };

    const isEdited = (position) => {
        if (value && value[position] && value[position].content) {
            return true;
        }
        return false;
    };

    return (
        <>
            <Label className="mt-25">Frame Position</Label>
            <Tab type="boxed" selected={lastPosition} onSelect={handleSelect}>
                <TabOption isEdited={isEdited('top')} value="top">
                    Top
                </TabOption>
                <TabOption isEdited={isEdited('bottom')} value="bottom">
                    Bottom
                </TabOption>
                <TabOption isEdited={isEdited('corner')} value="corner">
                    Corner
                </TabOption>
            </Tab>

            <Label className="mt-25">Frame Style</Label>
            <IconFilter
                itemHeight="50px"
                onFilter={handleFilter}
                value={lastPosValue.frameId}
                placeholder="Search for Frames"
                cols={lastPosition === 'corner' && 6}
            >
                {lastPosFrames.map((frame, frIdx) => (
                    <IconOption
                        key={frIdx}
                        isFrames={true}
                        value={frame.id}
                        style={
                            frame.title
                                ? { border: '1px dashed #e5ebf0' }
                                : null
                        }
                        onClick={() =>
                            handleChange({
                                name: 'frameId',
                                value: frame.id,
                            })
                        }
                        dangerouslySetInnerHTML={{
                            __html: frame.title ? frame.title : frame.content,
                        }}
                    />
                ))}
            </IconFilter>

            {lastPosition === 'corner' && (
                <>
                    <Label className="mt-25">Corner Position</Label>
                    <SelectInput
                        name="cornerPosition"
                        options={cornerOptions}
                        onChange={handleChange}
                        value={lastPosValue.cornerPosition || 'top-right'}
                    />
                </>
            )}

            <Label className="mt-25">Color</Label>
            <ColorPicker
                name="color"
                onChange={handleChange}
                value={lastPosValue.color}
            />

            <Label className="mt-25">Height</Label>
            <Range
                max={500}
                name="height"
                defaultUnit="px"
                placeholder="auto"
                onChange={handleChange}
                value={lastPosValue.height}
            />

            {lastPosition === 'corner' && (
                <>
                    <Label className="mt-25">Width</Label>
                    <Range
                        max={500}
                        name="width"
                        defaultUnit="px"
                        placeholder="auto"
                        onChange={handleChange}
                        value={lastPosValue.width}
                    />
                </>
            )}

            {lastPosition !== 'corner' && (
                <>
                    <Label className="mt-25">Flip</Label>
                    <Tab
                        type="boxed"
                        name="flip"
                        onSelect={handleChange}
                        selected={lastPosValue.flip}
                    >
                        <TabOption value="">Default</TabOption>
                        <TabOption value="rotateY(180deg)">
                            Horizontal
                        </TabOption>
                    </Tab>
                </>
            )}
        </>
    );
};

export default React.memo(SectionFrame);

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
