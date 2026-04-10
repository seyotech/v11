import { Input } from 'antd';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FileUploadContext } from '../context/FileUploadContext';
import { entityTypeEnum } from 'constants/mediaEntityTypeEnum';

const { Search } = Input;
const WrapWithSearchBar = ({ children }) => {
    const { t } = useTranslation('builder');
    const { searchMedia } = useContext(FileUploadContext);

    return (
        <div>
            <Search
                placeholder={`${t('Search')}...`}
                enterButton={t('Search')}
                style={{
                    marginBottom: '16px',
                }}
                onChange={(event) => {
                    searchMedia({
                        event,
                        entityType: entityTypeEnum.REGULAR,
                    });
                }}
            />
            {children}
        </div>
    );
};

export default WrapWithSearchBar;
