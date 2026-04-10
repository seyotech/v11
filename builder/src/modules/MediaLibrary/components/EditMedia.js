import { Form, Input, Modal, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Represents a EditMedia component.
 * This component is responsible for renaming the media name.
 *
 *
 * @param {Object} props - The props for the EditMedia component.
 * @param {function} props.setOpen - The handler for open and close modal
 * @param {boolean} open - The indicator for whether modal should be opened of not
 * @param {string} name - The name of the media
 * @param {string} id - The id of the media
 * @param {boolean} handleEditMedia - The handler for renaming medial
 *
 * @returns {JSX.Element} The rendered Dropdown component.
 *
 * @example
 * <EditMedia
 *      name='file1'
 *      open={true}
 *      setOpen={setOpen}
 *      id="2345678dfghjk1234567"
 *      handleEditMedia={handleEditMedia}
 * />
 *
 */
export const EditMedia = ({ setOpen, open, name, id, handleEditMedia }) => {
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation('builder');
    const [form] = Form.useForm();

    const closeModal = () => {
        setOpen(false);
        form.resetFields();
    };

    const handleSubmit = async (value) => {
        setLoading(true);

        await handleEditMedia({ ...value, id });

        setLoading(false);
        closeModal();
    };
    return (
        <Modal
            open={open}
            centered
            width={520}
            title={
                <Typography.Text style={{ fontSize: 16 }}>
                    {t('Rename Media')}
                </Typography.Text>
            }
            onCancel={closeModal}
            onOk={form.submit}
            okButtonProps={{ size: 'small', loading, disabled: loading }}
            cancelButtonProps={{
                size: 'small',
            }}
            okText={t('Save')}
        >
            <Form
                onFinish={handleSubmit}
                form={form}
                size="small"
                layout="vertical"
                style={{ marginTop: 16 }}
                initialValues={{ name }}
            >
                <Form.Item label={t('Enter New Name')} name="name">
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};
