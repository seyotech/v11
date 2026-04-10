import { Space } from 'antd';
import elements from '../../Element/data/elements';
import Media from './Media';

const Videos = ({ data, handleDeleteMedia, handleEditMedia }) => {
    const videoEl = elements[0].items.find(
        (el) => el.data.type === 'video'
    ).data;
    return (
        <Space wrap={true} size={8}>
            {data.map((item) => (
                <Media
                    key={item.id}
                    data={item}
                    element={videoEl}
                    handleDeleteMedia={handleDeleteMedia}
                    handleEditMedia={handleEditMedia}
                />
            ))}
        </Space>
    );
};

export default Videos;
