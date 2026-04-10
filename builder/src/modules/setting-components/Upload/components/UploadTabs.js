import { Tabs } from 'antd';
import AIImageMediaLibrary from 'modules/AIImages/AIImageMediaLibrary';
import { AIImageContextProvider } from 'modules/AIImages/context';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ucFirst from 'util/ucFirst';
import { FileUploadContext } from '../context/FileUploadContext';
import MediaView from './MediaView';
import Upload from './Upload';
import WrapWithSearchBar from './WrapWithSearchBar';
import UnsplashImgs from 'modules/UnsplashImgs';

const UploadTabs = ({ activeKey, setState, entityType }) => {
    const { type } = useContext(FileUploadContext);
    const { t } = useTranslation('builder');
    const items = [
        {
            key: '1',
            label: t(`{{type}} Library`, { type: ucFirst(type) }),
            children: (
                <WrapWithSearchBar>
                    <MediaView />
                </WrapWithSearchBar>
            ),
        },
        {
            key: '2',
            label: t(`Upload {{type}}`, { type: ucFirst(type) }),
            children: <Upload entityType={entityType} />,
        },
        {
            key: '3',
            label: t('Generate With AI'),
            children: (
                <AIImageContextProvider>
                    <AIImageMediaLibrary entityType={entityType} />
                </AIImageContextProvider>
            ),
        },
        {
            key: '4',
            label: t('Unsplash'),
            children: (
                <AIImageContextProvider>
                    <UnsplashImgs entityType={entityType} />
                </AIImageContextProvider>
            ),
        },
        // {
        //     key: '4',
        //     label: t('Illustrations'),
        //     children: 'Content of Tab Pane 3',
        //     disabled: true,
        // },
        // {
        //     key: '5',
        //     label: t('Stock Photos'),
        //     children: 'Content of Tab Pane 3',
        //     disabled: true,
        // },
    ];

    return (
        <Tabs
            onChange={(activeKey) =>
                setState((prev) => ({ ...prev, activeKey }))
            }
            items={items}
            style={{ flex: 1 }}
            activeKey={activeKey}
            defaultActiveKey="1"
        />
    );
};

export default UploadTabs;
