import { Spin } from 'antd';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import styled from 'styled-components';

const SimpleBarStc = styled(SimpleBar)`
    width: 100%;
    height: ${({ height }) =>
        height ? (isNaN(height) ? `${height}` : `${height}px`) : '100%'};
    box-sizing: border-box;
    margin: 0;
    overflow-x: hidden;
    padding-bottom: 20px !important;
`;

const LoaderWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: ${({ hasNextPage }) => (hasNextPage ? 'end' : 'center')};
    height: ${({ hasNextPage, height }) =>
        hasNextPage
            ? null
            : height
            ? isNaN(height)
                ? `${height}`
                : `${height}px`
            : '100%'};
    margin-top: 10px;
`;

const InfiniteScroll = ({
    hasNextPage,
    fetchNextPage,
    loader,
    children,
    height,
    dataLength,
}) => {
    const [scrollover, setScrollOver] = useState(false);
    const loadMoreRef = useRef(null);
    useEffect(() => {
        const loadMoreRefCurrent = loadMoreRef.current;
        setScrollOver(false);
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setScrollOver(true);
                    fetchNextPage();
                }
            },
            { threshold: 1 }
        );

        if (loadMoreRefCurrent) {
            observer.observe(loadMoreRefCurrent);
        }

        return () => {
            if (loadMoreRefCurrent) {
                observer.unobserve(loadMoreRefCurrent);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataLength]);

    return (
        <SimpleBarStc height={height}>
            {children}
            {hasNextPage && (
                <button
                    ref={loadMoreRef}
                    style={{
                        visibility: 'hidden',
                    }}
                ></button>
            )}
            {!dataLength || (scrollover && hasNextPage) ? (
                <LoaderWrapper height={height} hasNextPage={hasNextPage}>
                    {loader ? loader : <Spin />}
                </LoaderWrapper>
            ) : null}
        </SimpleBarStc>
    );
};

InfiniteScroll.prototype = {
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    dataLength: PropTypes.number.isRequired,
    children: PropTypes.element.isRequired,
    loader: PropTypes.element,
    fetchNextPage: PropTypes.func.isRequired,
    hasNextPage: PropTypes.bool.isRequired,
};

export default InfiniteScroll;
