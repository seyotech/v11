import React, { useContext } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../other-components/Button';
import { ElementContext } from '../../contexts/ElementRenderContext';

const Wrapper = styled.div``;

const ResponsiveControl = ({ display, isSidebar }) => {
    const { handleResponsiveEditorMode } = useContext(ElementContext);

    const getStyle = (type) => {
        return {
            padding: '0 4px',
            color: type === display ? '#0062ff' : null,
        };
    };

    return (
        <Wrapper>
            <Button
                type="none"
                style={getStyle('desktop')}
                size={isSidebar && 'sm'}
                onClick={() => handleResponsiveEditorMode('desktop')}
            >
                <FontAwesomeIcon icon={['fas', 'desktop-alt']} />
            </Button>
            <Button
                type="none"
                style={getStyle('tablet')}
                size={isSidebar && 'sm'}
                onClick={() => handleResponsiveEditorMode('tablet')}
            >
                <FontAwesomeIcon icon={['fas', 'tablet-alt']} />
            </Button>
            <Button
                type="none"
                size={isSidebar && 'sm'}
                style={getStyle('mobile')}
                onClick={() => handleResponsiveEditorMode('mobile')}
            >
                <FontAwesomeIcon icon={['fas', 'mobile-alt']} />
            </Button>
        </Wrapper>
    );
};
export default ResponsiveControl;
