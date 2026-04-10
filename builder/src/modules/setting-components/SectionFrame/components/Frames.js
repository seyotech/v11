import { List } from 'antd';
import PropType from 'prop-types';

import sectionFrames from 'components/editor-resources/section-frames';
import { FrameStc } from './FrameStc';
import { useTranslation } from 'react-i18next';

export const Frames = ({ position, onSelect, frameId }) => {
    const data = sectionFrames.filter((frame) => frame.position === position);
    const { t } = useTranslation();
    const gridCount = position === 'corner' ? 4 : 1;

    const handleFrameSelect = (currentFrameId) => {
        if (currentFrameId === frameId) return;
        onSelect({
            name: 'frameId',
            value: currentFrameId,
        });
    };

    return (
        <FrameStc gridCount={gridCount} gridHeight={gridCount > 1 ? 32 : 16}>
            <List
                size="small"
                dataSource={data}
                renderItem={(frame) => (
                    <List.Item
                        key={frame.id}
                        data-testid={`frame-${frame.id}`}
                        className={frameId === frame.id ? 'active' : ''}
                        onClick={() => handleFrameSelect(frame.id)}
                    >
                        <div
                            className="frame"
                            dangerouslySetInnerHTML={{
                                __html: frame.title
                                    ? t(frame.title)
                                    : frame.content,
                            }}
                        />
                    </List.Item>
                )}
            />
        </FrameStc>
    );
};

Frames.propTypes = {
    onSelect: PropType.func.isRequired,
    frameId: PropType.string.isRequired,
    position: PropType.string.isRequired,
};
