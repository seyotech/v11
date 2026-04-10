import { Card, Col, Image, Row, Typography } from 'antd';
import { useRef } from 'react';
import { useDragLayer } from 'react-dnd';
import styled, { css } from 'styled-components';
import { antToken } from '../../../antd.theme';

function getPreviewStyles({ $isDragging, targetoffset, $isOutSideDrawer }) {
    let { x = 0, y = 0 } = targetoffset;
    //positioning the cursor at the center of the  custom drag preview
    x = x - 55;
    y = y - 42;
    //adjusting the shifting of coordinates due to going inside the iframe
    if ($isOutSideDrawer) {
        x = x + 50;
        y = y + 40;
    }

    return css`
        transition: ${!$isDragging
            ? 'top 0.5s ease-in-out, left .5s ease-in-out, transform .5s ease-in-out'
            : ''};
        transform: ${!$isDragging ? 'scale(0)' : 'scale(1)'};
        left: ${x}px;
        top: ${y}px;
    `;
}

const PreviewStc = styled(Card)`
    && {
        position: fixed;
        pointer-events: none;
        z-index: 1000000;
        width: 110px;
        height: 84px;
        background: white;
        opacity: 0.8;
        border-radius: 4px;
        .ant-card-body {
            padding: 12px 8px;
        }
        & .imageWrapper {
            padding: 4px;
            border-radius: 2px;
            border: 1px solid ${antToken.colorBorder};
            width: 100%;
        }
        ${getPreviewStyles}
    }
`;

/**
 * @component
 * @example
 * // Example usage of isOutSideDrawer component
 * <CustomDragLayer isOutSideDrawer={true}/>
 *
 * @param {Object} props - The component's props.
 * @param {Boolean} props.isOutSideDrawer - Whether the custom drag preview is outside the drawer or not.
 * @param {Boolean} props.isCustomDragPreviewAllowed - Whether to avoid th dnd effect among the items inside the iframe and and other drawer
 *
 * @returns {JSX.Element | null} The rendered content or null based on the didDrop.
 */
const CustomDragLayer = ({ isOutSideDrawer, isCustomDragPreviewAllowed }) => {
    const prevDragRef = useRef({});

    const { isDragging, item, didDrop, targetoffset } = useDragLayer(
        (monitor) => {
            const initialOffset = monitor.getInitialClientOffset();
            const isDragging = monitor.isDragging();
            if (initialOffset && isDragging) {
                prevDragRef.current.initialOffset = initialOffset;
            }
            return {
                item: monitor.getItem(),
                isDragging: monitor.isDragging(),
                didDrop: monitor.didDrop(),
                targetoffset:
                    monitor.getClientOffset() ||
                    prevDragRef.current.initialOffset ||
                    {},
            };
        }
    );

    //to avoid th dnd effect among the items inside the iframe and and other drawer
    if (!isCustomDragPreviewAllowed) {
        return null;
    }

    return !didDrop ? (
        <PreviewStc
            data-testid={`customDragPreview`}
            {...{
                $isDragging: isDragging,
                targetoffset,
                $isOutSideDrawer: isOutSideDrawer,
            }}
        >
            <Row gutter={[8, 8]}>
                <Col span={24}>
                    {item?.thumbnail ? (
                        <div className="imageWrapper">
                            <Image
                                className="thumbnail"
                                width="100%"
                                height="32px"
                                preview={false}
                                src={item?.thumbnail}
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    ) : (
                        <Typography.Text
                            style={{ width: '100%', textAlign: 'center' }}
                            ellipsis
                            strong
                        >
                            {item?.title}
                        </Typography.Text>
                    )}
                </Col>
                <Col span={24}>
                    <Typography.Text
                        style={{ width: '100%', textAlign: 'center' }}
                        ellipsis
                    >
                        {item?.tag}
                    </Typography.Text>
                </Col>
            </Row>
        </PreviewStc>
    ) : null;
};

export default CustomDragLayer;
