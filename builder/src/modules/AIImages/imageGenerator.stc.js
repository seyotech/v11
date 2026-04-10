import styled, { createGlobalStyle } from 'styled-components';

export const Wrapper = styled.div`
    width: 100%;
    .ant-form {
        width: 100%;
    }
    .loader {
        display: block;
        font-size: 24px;
        text-align: center;
    }
    .unsplash-image-section,
    .ai-image-section {
        height: 411px;
        overflow: auto;
    }
`;
export const CustomInput = styled.div`
    display: flex;
    width: 100%;
    margin-bottom: 20px;
    .ant-input {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    .ant-input-group-addon:last-child {
        border-radius: 0;
    }

    .generate-btn {
        border-left: 0;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
`;
export const EmptyBlock = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
`;
export const ImagesWrapStc = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;

    @media screen and (max-width: 767px) {
        grid-template-columns: repeat(2, 1fr);
    }
`;

export const AIImage = styled.div`
    width: 100%;
    height: ${({ height }) => height || '200px'};
    overflow: hidden;
    position: relative;
    border-radius: 6px;
    transition: all 0.3s;
    border: 1px solid #e5ebf0;
    img {
        width: 100%;
        object-fit: cover;
    }

    &:hover .media-overlay {
        opacity: 1;
    }
    img {
        width: 100%;
        height: 100%;
        max-height: 200px;
        object-fit: contain;
    }

    .hover-content {
        visibility: hidden;
        position: absolute;
        left: 50%;
        gap: 10px;
        bottom: 20px;
        width: 100%;
        display: flex;
        border-radius: 4px;
        justify-content: center;
        align-items: end;
        transform: translateX(-50%);
        p {
            font-size: 12px;
            color: #fff;
            margin-top: 6px;
        }
    }
    &:hover .hover-content {
        visibility: visible;
    }
`;

export const ModalGlobalStc = createGlobalStyle`
    .custom-modal .ant-modal-mask,
    .custom-modal .ant-modal-wrap{
       z-index: 1000 !important;
    }
   
`;
