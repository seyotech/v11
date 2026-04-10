import { Space } from 'antd';
import elements from 'modules/Element/data/elements';
import Media from './Media';

const Images = ({ data, handleDeleteMedia, handleEditMedia }) => {
    const imageEl = elements[0].items.find(
        (el) => el.data.type === 'image'
    ).data;

    return (
        <Space wrap={true} size={8}>
            {data.map((item) => (
                <Media
                    key={item.id}
                    data={item}
                    element={imageEl}
                    handleEditMedia={handleEditMedia}
                    handleDeleteMedia={handleDeleteMedia}
                />
            ))}
        </Space>
    );
};

export default Images;
