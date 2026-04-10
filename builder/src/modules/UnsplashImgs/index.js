import React, { useState } from 'react';
import { Form } from 'antd';
import { Wrapper } from '../AIImages/imageGenerator.stc';
import { nanoid } from 'nanoid';
import { useTranslation } from 'react-i18next';
import { useToast } from 'util/toast';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useGetUnsplashImage } from '../AI/utils/ai.query';
import ImageGenerationForm from './GenerateForm';
import { RenderAIImages } from 'modules/AIImages/Components';
import useAIImage from 'modules/AIImages/useAIImage';
import Loading from 'components/Loading';
import { entityTypeEnum } from 'constants/mediaEntityTypeEnum';

function UnsplashImgs({ entityType = entityTypeEnum.REGULAR }) {
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const { t } = useTranslation('builder');
    const [form] = Form.useForm();
    const [formValues, setFormValues] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const { images = [], setImages } = useAIImage();
    const prompt = Form.useWatch('prompt', form)?.trim();
    const {
        mutateAsync: getUnsplashImage,
        data = [],
        isLoading,
    } = useGetUnsplashImage();

    const fetchImages = async ({ orientation, ...values }) => {
        const data = await getUnsplashImage({
            orientation,
            ...values,
        });

        const images = data.map((item) => ({
            id: nanoid(6),
            ...item,
            src: item.download,
            orient: orientation,
        }));
        return images;
    };
    const handleFinish = async ({ prompt, orientation = 'landscape' }) => {
        try {
            setImages({ images: [] });
            setLoading(true);
            setFormValues({ prompt, orientation });
            setCurrentPage(1);
            const images = await fetchImages({
                prompt,
                page: 1,
                perPage: 16,
                orientation,
            });

            setImages({ images });
            setLoading(false);
        } catch (error) {
            console.log({ error });
            setLoading(false);
            toast('error', error.message || t('Something went wrong!!'));
        }
    };

    const hasNextPage = data?.length >= 15;

    const handleLoadMore = async () => {
        if (!isLoading && hasNextPage) {
            setCurrentPage((prev) => prev + 1);
            const images = await fetchImages({
                ...formValues,
                perPage: 15,
                page: currentPage + 1,
            });
            setImages({ images, merge: true });
        }
    };

    return (
        <Wrapper>
            <Form
                defaultValue={{ orientation: 'landscape' }}
                form={form}
                onFinish={handleFinish}
                layout="vertical"
            >
                <ImageGenerationForm
                    disabled={!prompt?.trim()}
                    loading={isLoading && loading}
                />
            </Form>

            <div className="unsplash-image-section" id="unsplash-image-section">
                <InfiniteScroll
                    dataLength={images?.length}
                    next={handleLoadMore}
                    hasMore={isLoading || hasNextPage}
                    loader={<Loading />}
                    scrollableTarget="unsplash-image-section"
                >
                    <RenderAIImages
                        isLoading={isLoading}
                        entityType={entityType}
                    />
                </InfiniteScroll>
            </div>
        </Wrapper>
    );
}

export default UnsplashImgs;
