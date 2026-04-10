/*****************************************************
 * Packages
 ******************************************************/
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Input, Space, Tooltip } from 'antd';

/*****************************************************
 * Locals
 ******************************************************/
import { BuilderContext } from 'contexts/BuilderContext';
import { EditorContext, ElementContext } from 'contexts/ElementRenderContext';
import { useGetFileURL } from 'modules/Shared/hooks/useGetFileURL';
import RenderComponentWithLabel from 'modules/Shared/settings-components/RenderComponentWithLabel';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getFirstImageURL } from '../utils/upload';
import { PreviewArea } from './PreviewArea';
import { iconStyles } from './Upload.stc';
import useCMS from 'hooks/useCMS';

export const Uploader = (props) => {
    const { currentPageInfo = {} } = useContext(ElementContext);
    const isTemplatePage = currentPageInfo.pageType === 'TEMPLATE';
    const { data: templatePageData } = useCMS() || {};
    const {
        name,
        compile = true,
        value,
        onChange,
        type = 'image',
        openMedia,
    } = props;
    const ctx = useContext(EditorContext);
    const getFileURL = useGetFileURL();
    const { t } = useTranslation('builder');
    const [focused, setFocused] = useState(false);

    const [inputURL, setInputURL] = useState(value);

    const handleChange = useCallback(
        (e) => onChange({ name, value: e.target.value.trim() }),
        [name, onChange]
    );

    const handleRemoveMedia = (e) => {
        e.stopPropagation();
        onChange({ name, value: '' });
    };

    useEffect(() => {
        const itemId = ctx?.currentEditItem.id;
        let firstImgURL = getFirstImageURL({
            itemId,
            value,
            templatePageData,
            isTemplatePage,
        });
        if (isTemplatePage && !itemId) {
            firstImgURL = getFileURL(firstImgURL);
        }
        setInputURL(firstImgURL);
    }, [ctx, value, isTemplatePage, templatePageData]);

    return (
        <RenderComponentWithLabel
            {...props}
            labelExtra={
                <Space>
                    {type === 'image' && (
                        <Tooltip
                            placement="topLeft"
                            title={t('Generate Image with AI')}
                        >
                            <Button
                                style={{
                                    fontSize: 14,
                                    cursor: 'pointer',
                                }}
                                type="text"
                                size="small"
                            >
                                <FontAwesomeIcon
                                    style={iconStyles}
                                    onClick={() => {
                                        openMedia('3');
                                    }}
                                    icon={icon({
                                        name: 'sparkles',
                                        type: 'regular',
                                    })}
                                />
                            </Button>
                        </Tooltip>
                    )}
                </Space>
            }
        >
            <PreviewArea
                type={type}
                inputURL={inputURL}
                openMedia={openMedia}
                handleChange={handleChange}
                handleRemoveMedia={handleRemoveMedia}
            />
            <Input
                name={name}
                size="small"
                addonBefore={t('URL')}
                onChange={handleChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                value={
                    !compile ? value : focused ? inputURL : getFileURL(inputURL)
                }
            />
        </RenderComponentWithLabel>
    );
};
