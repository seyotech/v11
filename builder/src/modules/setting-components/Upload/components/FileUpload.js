/*****************************************************
 * Packages
 ******************************************************/
import { useContext, useState } from 'react';
import debounce from 'lodash/debounce';

/*****************************************************
 * Locals
 ******************************************************/
import { BuilderContext } from 'contexts/BuilderContext';
import { useTranslation } from 'react-i18next';
import FileUploadContextProvider from '../context/FileUploadContext';
import FileUploadModal from './FileUploadModal';
import { Uploader } from './Uploader';
import { entityTypeEnum } from 'constants/mediaEntityTypeEnum';

const FileUpload = (props) => {
    const { name, accept, onChange, size = 6, type = 'image' } = props;
    const { user } = useContext(BuilderContext);
    const { t } = useTranslation('builder');

    const debouncedOnChange = debounce((props) => {
        onChange(props);
        setOpen(false);
    }, 200);

    const onSuccess = (value) => {
        onChange({ name, value: '' });
        debouncedOnChange({ name, value });
    };

    const [open, setOpen] = useState(false);

    if (!user?.id)
        return (
            <a
                style={{
                    fontSize: 12,
                    textAlign: 'center',
                    textDecoration: 'none',
                }}
                href="/login"
            >
                {t('Sign Up or Login to Upload')}
            </a>
        );

    const openMedia = (key) => setOpen(key || true);

    return (
        <>
            <FileUploadContextProvider
                value={{
                    type,
                    size,
                    accept,
                    onSuccess,
                }}
            >
                <Uploader
                    {...props}
                    openMedia={openMedia}
                    type={props.type || 'image'}
                />
                <FileUploadModal
                    type={type}
                    open={open}
                    setOpen={setOpen}
                    entityType={props.entityType || entityTypeEnum.REGULAR}
                />
            </FileUploadContextProvider>
        </>
    );
};

export default FileUpload;
