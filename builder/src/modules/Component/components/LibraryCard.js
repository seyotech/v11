/*****************************************************
 * packages
 ******************************************************/
import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Card,
    Image,
    Popconfirm,
    Popover,
    Spin,
    Tooltip,
    Typography,
} from 'antd';
import T from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';

/*****************************************************
 * Locals
 ******************************************************/
import { BuilderContext } from '@/contexts/BuilderContext';
import { getDnDConfig } from '@/util/dndHelpers';
import { ElementContext } from 'contexts/ElementRenderContext';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useTranslation } from 'react-i18next';
import { antToken } from '../../../antd.theme';
import { EL_TYPES } from '../../../constants/index';

const CardStc = styled(Card)`
    && {
        position: relative;
        border-radius: 4px;
        width: 100%;
        cursor: ${({ isDragging, canDrag }) =>
            canDrag ? (isDragging ? 'grabbing' : 'grab') : 'pointer'};
        opacity: ${({ isDragging }) => (isDragging ? 0.5 : 1)};
        &:hover {
            border-color: #aea6dc;
        }
        .ant-card-body {
            padding: 8px;
        }
        & .remove {
            position: absolute;
            top: 0;
            right: 0;
            color: #fff;
            width: 24px;
            height: 24px;
            z-index: 9999;
            display: flex;
            cursor: pointer;
            position: absolute;
            align-items: center;
            justify-content: center;
            border-radius: 0 0 0 6px;
            background: ${antToken.colorLink};
            border-left: 1px solid ${({ theme }) => theme.inputBorder};
            border-bottom: 1px solid ${({ theme }) => theme.inputBorder};
        }
        & .ant-spin-nested-loading {
            height: 100%;
            & .ant-spin-container {
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                gap: 8px;
            }
        }
    }
`;

const getComponentInfo = (component) => {
    let { id, type, data } = component;

    let elType = type;

    const dndConfig = getDnDConfig(
        type === EL_TYPES.CMSROW ? 'cmsRow' : type.toLowerCase()
    );

    return {
        elType,
        addElType: elType,
        type: dndConfig.type,
        ...(data
            ? { data: typeof data === 'string' ? JSON.parse(data) : data }
            : { shouldFetchData: true, id }),
    };
};

function LibraryCard({
    tag,
    component,
    overlayStyle,
    canDrag = true,
    placement = 'rightTop',
    isProvided,
    handleDeleteElement,
}) {
    const { id, thumbnail, title, type, data: { symbolId } = {} } = component;
    const [showPreview, setShowPreview] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState();
    const [loading, setIsLoading] = useState(false);
    const { t } = useTranslation('builder');

    const { editAddress, addElement } = useContext(ElementContext);
    const { getElement } = useContext(BuilderContext);

    const info = getComponentInfo(component);
    const [{ isDragging }, connectDragSource, connectDragPreview] = useDrag(
        {
            type: info.type,
            item: {
                info,
                address: '',
                parentType: '',
                type: info.type,
                ...(symbolId && { symbolId }),
                tag,
                title,
                thumbnail: thumbnail || '/assets/images/image-placeholder.jpg',
                isFromDrawer: true,
            },

            collect: (monitor) => {
                const isDragging = monitor.isDragging();
                isDragging && setShowPreview(false);

                return {
                    isDragging,
                };
            },
        },
        [id]
    );

    useEffect(() => {
        connectDragPreview(getEmptyImage(), { captureDraggingState: true });
    }, []);

    const handleElementClick = () => {
        if (!editAddress) return;
        if (symbolId) {
            addElement({
                data: { symbolId },
                elType: type,
                insertAddress: editAddress,
            });
            return;
        }

        setIsLoading(true);
        getElement(id).then((data) => {
            const parsedData = JSON.parse(data);
            parsedData &&
                addElement({
                    ...info,
                    data: parsedData,
                    insertAddress: editAddress,
                });
            setIsLoading(false);
        });
    };

    return (
        <Popover
            open={showPreview}
            placement={placement}
            arrow={false}
            content={
                <Image
                    data-testid={`previewImg-${id}`}
                    width="100%"
                    preview={false}
                    src={thumbnail}
                />
            }
            overlayStyle={
                overlayStyle ?? {
                    width: '496px',
                    left: '310px',
                }
            }
            overlayInnerStyle={{
                padding: '19.61px',
            }}
        >
            <CardStc
                size="small"
                bodyStyle={{ height: '100%' }}
                canDrag={canDrag}
                isDragging={isDragging}
                data-testid={`card-${id}`}
                onClick={handleElementClick}
                role={`draggable-element-${id}`}
                onMouseOver={() => {
                    setShowPreview(!!thumbnail);
                    isProvided && setShowDeleteButton(true);
                }}
                onMouseLeave={() => {
                    setShowPreview(false);
                    isProvided && setShowDeleteButton(false);
                }}
                ref={(node) => canDrag && connectDragSource(node)}
            >
                <Spin spinning={loading} size="small">
                    {showDeleteButton && (
                        <Popconfirm
                            title={t(`Remove the {{type}}`, { type })}
                            description={t(
                                `Are you sure to Remove this {{type}}`,
                                { type }
                            )}
                            onConfirm={async (e) => {
                                e.stopPropagation();
                                await handleDeleteElement(id, type);
                            }}
                            onCancel={(e) => {
                                e.stopPropagation();
                            }}
                            okText={t('Yes')}
                            cancelText={t('No')}
                            placement="left"
                        >
                            <Tooltip title={t(`Remove the {{type}}`, { type })}>
                                <span
                                    className="remove"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <FontAwesomeIcon
                                        fixedWidth
                                        data-testid="remove-preview"
                                        icon={regular('trash')}
                                    />
                                </span>
                            </Tooltip>
                        </Popconfirm>
                    )}
                    <Image
                        width="100%"
                        preview={false}
                        src={
                            thumbnail || '/assets/images/image-placeholder.jpg'
                        }
                        data-testid={`image-${id}`}
                    />
                    <Typography.Text style={{ width: '100%' }} ellipsis strong>
                        {title}
                    </Typography.Text>
                </Spin>
            </CardStc>
        </Popover>
    );
}

LibraryCard.propTypes = {
    component: T.element.isRequired,
};

export default LibraryCard;
