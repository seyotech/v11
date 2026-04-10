import { Empty } from 'antd';
import { downloadImage } from 'modules/AI/utils/ai.service';
import { withCompressor } from 'modules/AI/utils/withCompressor';
import { useGetFileURL } from 'modules/Shared/hooks/useGetFileURL';
import { FileUploadContext } from 'modules/setting-components/Upload/context/FileUploadContext';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../util/toast';
import { ImagesWrapStc, EmptyBlock } from '../imageGenerator.stc';
import useAIImage from '../useAIImage';
import RenderImage from './RenderImage';

function RenderAIImages({ isLoading, entityType }) {
    const { images = [], handleUploadMedia } = useAIImage();
    const [loading, setLoading] = useState(false);
    const [uploadedImgs, setUploadedImgs] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const { onSuccess } = useContext(FileUploadContext);
    const { t } = useTranslation('builder');
    const getFileURL = useGetFileURL();
    const toast = useToast();

    const handleClick = async (props) => {
        const { src, skipNotify, id, cb } = props;
        try {
            setLoading(true);
            setSelectedId(id);
            const blob = await downloadImage({ src });
            if (blob) {
                const { file, kind } = await withCompressor({ blob });
                const res = await handleUploadMedia({
                    fileList: [file],
                    kind,
                    entityType,
                });
                if (res) {
                    !skipNotify &&
                        toast(
                            'success',
                            t(
                                'Your image was successfully added to the image library.'
                            )
                        );
                    setUploadedImgs((prev) => [
                        ...prev,
                        { id, path: res[0]?.path },
                    ]);
                    cb && cb(res[0]?.path);
                }
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast('error', t('Something went wrong!!'));
        }
    };
    const handleInsertImage = (props) => {
        const uploaded = uploadedImgs.find((img) => img.id === props.id);
        if (uploaded) {
            return onSuccess(getFileURL(uploaded.path));
        }
        const cb = (path) => onSuccess(getFileURL(path));
        handleClick({ ...props, skipNotify: true, cb });
    };

    if (!images.length && !isLoading)
        return (
            <EmptyBlock>
                <Empty description={t('No image available')} />
            </EmptyBlock>
        );
    return (
        <ImagesWrapStc>
            {images.map((image) => {
                const isLoading = selectedId === image.id && loading;
                return (
                    <RenderImage
                        key={image.id}
                        image={image}
                        loading={loading}
                        isLoading={isLoading}
                        handleClick={handleClick}
                        uploadedImgs={uploadedImgs}
                        handleInsertImage={handleInsertImage}
                    />
                );
            })}
        </ImagesWrapStc>
    );
}

export default RenderAIImages;
