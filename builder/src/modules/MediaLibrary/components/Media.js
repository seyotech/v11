import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Image, App } from 'antd';
import Video from 'modules/Shared/Video/Video';
import propTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Dropdown } from 'modules/Shared/Dropdown';
import { Floating } from 'modules/Shared/Floating';
import { useGetFileURL } from 'modules/Shared/hooks/useGetFileURL';
import generateElementData, {
    getDropdownOptions,
} from '../util/generateElementData';
import { EditMedia } from './EditMedia';

const MediaStc = styled.div`
    width: 110px;
    height: 80.86px;
    overflow: hidden;
    position: relative;
    border: 1px solid #d9d9d9;
    cursor: ${({ $isDragging }) => ($isDragging ? 'grabbing' : 'grab')};
    border-radius: 4px;
    .floating-ellipsis:not(.ant-dropdown-open) {
        visibility: hidden;
    }

    &:hover .floating-ellipsis {
        visibility: visible;
    }
`;

const Media = ({
    data,
    element,
    handleDeleteMedia,
    handleEditMedia,
    canDrag = true,
}) => {
    const { t } = useTranslation('builder');
    const [open, setOpen] = useState(false);
    const getFileURL = useGetFileURL();
    const { modal } = App.useApp();

    const isVideo = data?.kind === 'video';
    const info = generateElementData({ element, src: getFileURL(data.path) });
    const [{ isDragging }, connectDragSource, connectDragPreview] = useDrag(
        {
            type: info.type,
            item: {
                info,
                address: '',
                parentType: '',
                type: info.type,
                tag: element?.type.toUpperCase(),
                thumbnail: getFileURL(data.path),
                isFromDrawer: true,
            },

            collect: (monitor) => {
                return {
                    isDragging: monitor.isDragging(),
                };
            },
        },
        [element?.type]
    );

    const options = getDropdownOptions({
        data,
        setOpen,
        getFileURL,
        handleDeleteMedia,
        modal,
    });

    useEffect(() => {
        connectDragPreview(getEmptyImage(), { captureDraggingState: true });
    }, []);

    return (
        <MediaStc
            role="draggable-element"
            ref={(node) => canDrag && connectDragSource(node)}
            $isDragging={isDragging}
            data-testid={`drag-${data.id}`}
        >
            {isVideo ? (
                <Video name={data.name} src={getFileURL(data.path)} />
            ) : (
                <Image
                    width="100%"
                    height="100%"
                    src={getFileURL(data.path)}
                    alt={data.name}
                    preview={false}
                    style={{ borderRadius: '4px', objectFit: 'cover' }}
                />
            )}

            <Dropdown width="auto" options={options}>
                <Floating
                    className="floating-ellipsis"
                    position="-1px -1px"
                    style={{ background: '#3830b3' }}
                >
                    <FontAwesomeIcon
                        icon={icon({
                            name: 'ellipsis-v',
                            style: 'regular',
                        })}
                    />
                </Floating>
            </Dropdown>
            <EditMedia
                setOpen={setOpen}
                open={open}
                name={data.name}
                handleEditMedia={handleEditMedia}
                id={data.id}
            />
        </MediaStc>
    );
};

Media.propTypes = {
    data: propTypes.shape({
        id: propTypes.string.isRequired,
        name: propTypes.string.isRequired,
        size: propTypes.string.isRequired,
        kind: propTypes.string.isRequired,
        path: propTypes.string.isRequired,
        createdAt: propTypes.string.isRequired,
    }).isRequired,
    element: propTypes.object.isRequired,
};

export default Media;
