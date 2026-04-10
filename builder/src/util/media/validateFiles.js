import i18next from 'i18next';
import generateError from './generateError';
import isContainsScriptTag from './isContainsScriptTag';
import showNotification from './showNotification';

const validateFiles = async ({ files, size, accept, kind, skip }) => {
    try {
        const filterFiles = [];

        if (files.length > 20) {
            throw generateError({
                type: 'warning',
                message: i18next.t('Maximum 20 files are allowed.'),
            });
        }

        for (let file of files) {
            if (
                file.type === 'image/svg+xml' &&
                (await isContainsScriptTag(file))
            ) {
                throw generateError({
                    type: 'warning',
                    message: i18next.t(
                        'You have uploaded a malicious svg file so we have removed this file'
                    ),
                });
            }
            const partialAllowed = accept.includes(file.type);
            const allAllowed =
                accept.includes('/*') &&
                accept.includes(file.type.split('/')[0]);

            if (!allAllowed && !partialAllowed) {
                throw generateError({
                    type: 'warning',
                    message: i18next.t(`This file type is not supported.`),
                });
            }

            if (file.size / (1024 * 1024) > size) {
                throw generateError({
                    type: 'warning',
                    message: i18next.t(
                        `We accept highest ${size}MB ${kind} file`
                    ),
                });
            } else {
                filterFiles.push(file);
            }
        }

        return filterFiles;
    } catch (err) {
        if (err?.type && !skip) {
            showNotification({
                message: err.message,
                type: err.type,
            });
        }
    }
};

export default validateFiles;
