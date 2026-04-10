import { useUploadFiles } from '@s3-presigner/client';
import { BuilderContext } from 'contexts/BuilderContext';
import debounce from 'lodash.debounce';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import generateError from 'util/media/generateError';
import generateFileInfo, { getType } from 'util/media/generateFileInfo';
import showNotification from 'util/media/showNotification';
import ucFirst from 'util/ucFirst';

const useManageMedia = () => {
    const { t } = useTranslation('builder');
    const [uploading, setUploading] = useState(false);
    const { siteId, useMedia } = useContext(BuilderContext);
    const { onSelect } = useUploadFiles();
    const {
        updateMedia,
        fetchNextPage,
        handleSaveMedia,
        handleDeleteMedia: deleteMedia,
        uploadByPresignedUrl,
        isLoading,
        media,
    } = useMedia();

    /**
     * created presigned Url and uploaded file on the aws s3 to the presigned Url
     * @param {object} params
     * @param {Array<object>} params.fileList
     * @param {String} params.kind - Currently, three types of kind available like image, video, and font
     * @returns {Promise<Function>}
     */
    const handleUploadOnPresignedUrl = async ({
        fileList,
        kind,
        entityType,
    }) => {
        const mutationFn = onSelect(async (input) => {
            const { data: presignedURLs } = await uploadByPresignedUrl({
                kind,
                siteId,
                entityType,
                filesInfo: input.map((info) => ({
                    ...info,
                    type: getType(info),
                })),
            });
            return presignedURLs;
        });

        return mutationFn(fileList);
    };

    /**
     * saved file record on the server after Successfully upload file on s3
     * @param {object} params
     * @param {Array<object>} params.data
     * @param {String} params.kind - Currently, three types of kind available like image, video, and font
     * @returns {Promise<Function>}
     */
    const handleSaveFileRecords = ({ data, kind, entityType }) => {
        return handleSaveMedia({
            siteId,
            kind,
            entityType,
            files: generateFileInfo(data),
        });
    };

    const handleEditMedia = async ({ id, name }) => {
        try {
            const result = await updateMedia({ id, name });
            if (result) {
                showNotification({
                    message: t(`Successfully Renamed`),
                });
            }
            return result;
        } catch (error) {
            showNotification({
                message: t(`Something went wrong while renaming the media`),
            });
        }
    };

    /**
     * main function for file upload. after successful handleUploadOnPresignedUrl function this handler call handleSaveFileRecords function. also this function handle upload related errors and success
     * @param {object} params
     * @param {Array<object>} params.fileList
     * @param {String} params.kind - Currently, three types of kind available like image, video, and font
     * @returns {Array}
     */
    const handleUploadMedia = async ({ fileList, kind, entityType }) => {
        try {
            setUploading(true);

            const uploadRes = await handleUploadOnPresignedUrl({
                fileList,
                kind,
                entityType,
            });
            if (uploadRes.errors) {
                throw generateError({
                    message: uploadRes.errors[0].extensions.message,
                    type: 'error',
                });
            }

            const saveFileRecords = await handleSaveFileRecords({
                data: uploadRes,
                kind,
                entityType,
            });
            if (saveFileRecords.errors) {
                throw generateError({
                    message: uploadRes.errors[0].extensions.message,
                    type: 'error',
                });
            } else {
                showNotification({
                    message: `${ucFirst(kind)} Uploaded Successfully`,
                });
            }

            return saveFileRecords;
        } catch (err) {
            if (err?.type) {
                showNotification({
                    message: err.message,
                    type: err.type,
                });
            }
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteMedia = async ({ id, kind }) => {
        const { data } = await deleteMedia(id);
        if (data.deleteFile) {
            showNotification({
                type: 'success',
                message: `${ucFirst(kind)} Deleted Successfully`,
            });
        }
    };

    const searchMedia = debounce(({ event, entityType }) => {
        fetchNextPage({ search: event.target.value, entityType });
    }, 700);

    return {
        handleUploadMedia,
        handleDeleteMedia,
        searchMedia,
        fetchNextPage,
        handleEditMedia,
        media,
        isLoading,
        uploading,
    };
};

export default useManageMedia;
