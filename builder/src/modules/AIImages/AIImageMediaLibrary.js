import { Form } from 'antd';
import { nanoid } from 'nanoid';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from 'util/toast';
import { ImageGenerationForm, RenderAIImages } from './Components';
import { Wrapper } from './imageGenerator.stc';
import { useAIImageGenerate } from './query';
import useAIImage from './useAIImage';
import { entityTypeEnum } from 'constants/mediaEntityTypeEnum';

function AIImageMediaLibrary({ entityType = entityTypeEnum.REGULAR }) {
    const toast = useToast();
    const { t } = useTranslation('builder');
    const [form] = Form.useForm();
    const prompt = Form.useWatch('prompt', form)?.trim();
    const disabled = !prompt || prompt?.length < 20;

    const { aiFetcher, setImages } = useAIImage();
    const { mutateAsync: generateImage, isLoading } = useAIImageGenerate();
    const handleFinish = async (values) => {
        try {
            generateImage({ aiFetcher, ...values }).then((res) => {
                if (Array.isArray(res)) {
                    const images = res.map((item) => ({
                        id: nanoid(6),
                        ...item,
                        src: `data:image/png;base64,${item.b64_json}`,
                        orient: values.orientation,
                    }));
                    setImages({ images, merge: true, unshift: true });
                }
            });
        } catch (error) {
            console.log({ error });
            toast('error', error.message || t('Something went wrong!!'));
        }
    };
    useEffect(() => {
        const payload = {
            orientation: 'square',
            style: 'natural',
        };
        form.setFieldsValue(payload);
    }, [form]);

    return (
        <Wrapper>
            <Form
                form={form}
                onFinish={() => handleFinish(form.getFieldsValue())}
                layout="vertical"
            >
                <ImageGenerationForm disabled={disabled} loading={isLoading} />
            </Form>
            <div className="ai-image-section">
                <RenderAIImages entityType={entityType} />
            </div>
        </Wrapper>
    );
}

export default AIImageMediaLibrary;
