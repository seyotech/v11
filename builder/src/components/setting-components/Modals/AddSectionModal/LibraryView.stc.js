import styled from 'styled-components';
import { Body } from './AddSectionModal.stc';

export const Section = styled(Body)`
    gap: 10px;
    display: flex;
    flex-direction: row;
    width: 100%;
    height: auto;
    justify-content: center;
`;

export const Img = styled.img`
    width: 100%;
    min-height: 70px;
    background-size: contain;
    border-radius: 4px;
`;

export const Zoom = styled.div`
    width: 350px;
`;

export const ItemWrap = styled.div`
    width: 100%;
`;

export const Item = styled.div`
    cursor: pointer;
    position: relative;

    border-radius: 5px;
    border: 1px solid #e5ebf0;
    margin-bottom: 10px;
`;

export const RemoveWrap = styled.div`
    top: 10px;
    z-index: 2;
    right: 10px;
    position: absolute;
`;

export const Remove = styled.span`
    width: 30px;
    height: 30px;
    font-size: 14px;
    background: #fff;
    border-radius: 5px;
    align-items: center;
    display: inline-flex;
    justify-content: center;

    svg {
        color: var(--color-danger-500);
    }
`;

export const Desc = styled.div`
    top: 0;
    left: 0;
    color: #fff;
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 5px;
    background-image: linear-gradient(
        to bottom,
        transparent,
        rgba(0, 0, 0, 0.8)
    );
`;

export const Text = styled.p`
    bottom: 0;
    color: #ffffff;
    margin: 10px;
    position: absolute;
`;
